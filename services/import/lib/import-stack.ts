import * as cdk from 'aws-cdk-lib';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import path from 'path';

import Config from '../../../config';

export class ImportStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const importProductsFileFunction = new nodelambda.NodejsFunction(this, 'ImportProductsFile', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'importProductsFile',
      entry: path.join(__dirname, '../functions/importProductsFile.ts'),
      environment: {
        S3_BUCKET_NAME: Config.S3_BUCKET_NAME,
      },
    });

    const importFileParserFunction = new nodelambda.NodejsFunction(this, 'ImportFileParser', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'importFileParser',
      entry: path.join(__dirname, '../functions/importFileParser.ts'),
      environment: {
        S3_BUCKET_NAME: Config.S3_BUCKET_NAME,
      },
    });

    const api = new apigateway.RestApi(this, 'ImportApi', {
      restApiName: 'Import Service',
    });

    const importResource = api.root.addResource('import');
    importResource.addMethod('GET', new apigateway.LambdaIntegration(importProductsFileFunction), {
      requestParameters: {
        'method.request.querystring.name': true,
      },
    });

    const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: Config.S3_BUCKET_NAME,
      cors: [
        {
          allowedOrigins: [Config.UI_URL],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    [importProductsFileFunction, importFileParserFunction].forEach((fn) => bucket.grantReadWrite(fn));
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(importFileParserFunction), {
      prefix: 'uploaded/',
    });
  }
}
