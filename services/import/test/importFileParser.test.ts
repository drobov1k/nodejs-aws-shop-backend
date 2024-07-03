import { S3Event } from 'aws-lambda';
import { logger, processCsv } from '@core/helpers';
import { s3Client } from '@core/infra/s3';
import { importFileParser } from '../functions/importFileParser';
import Config from '../../../config';

let mockGetObject;
jest.mock('@core/infra/s3', () => ({
  s3Client: {
    getObject(_bucketName: string, _key: string) {
      return mockGetObject;
    },
    moveObject: jest.fn(),
  },
}));

jest.mock('@core/helpers', () => ({
  ...jest.requireActual('@core/helpers'),
  logger: {
    error: jest.fn(),
  },
  processCsv: jest.fn(),
}));

describe('S3 event: csv file is uploaded', () => {
  afterEach(() => {
    mockGetObject = null;
  });

  it('should log error if file is not found', async () => {
    const fileName = `file_${Date.now()}`;
    const event: S3Event = {
      Records: [
        {
          s3: {
            object: {
              key: fileName,
            },
          },
        },
      ],
    } as any;

    await importFileParser(event);

    expect(logger.error).toBeCalledWith(expect.any(Error));
    expect((logger.error as jest.Mock).mock.calls[0][0].message).toBe(
      `Can't find the file: bucket ${process.env.S3_BUCKET_NAME}, file ${fileName}`,
    );
  });

  it('should process csv and move object between folders into bucket', async () => {
    const key = 'uploaded/filename.csv';
    const event: S3Event = {
      Records: [
        {
          s3: {
            object: {
              key,
            },
          },
        },
      ],
    } as any;

    mockGetObject = Object.create(null);
    await importFileParser(event);

    expect(processCsv).toBeCalledWith(mockGetObject, logger.log);
    expect(s3Client.moveObject).toBeCalledWith({
      sourceBucket: Config.S3_BUCKET_NAME,
      sourceKey: key,
      destinationKey: `parsed/${key.split('/')[1]}`,
    });
  });
});
