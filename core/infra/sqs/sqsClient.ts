import {
  SQSClient as AWSSQSClient,
  SendMessageCommand,
  SendMessageCommandOutput,
  SendMessageBatchCommand,
} from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';

interface ISQSClient {
  sendMessage(queueUrl: string, messageBody: string): Promise<SendMessageCommandOutput>;
  sendMessageBatch(queueUrl: string, messageBodies: string[]): Promise<SendMessageCommandOutput>;
}

export class SQSClient extends AWSSQSClient implements ISQSClient {
  sendMessage(queueUrl: string, messageBody: string): Promise<SendMessageCommandOutput> {
    return this.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      }),
    );
  }

  sendMessageBatch(queueUrl: string, messageBodies: string[]): Promise<SendMessageCommandOutput> {
    return this.send(
      new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: messageBodies.map((messageBody) => ({
          Id: uuidv4(),
          MessageBody: messageBody,
        })),
      }),
    );
  }
}
