import * as cdk from 'aws-cdk-lib';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

import Config from '../../../config';

export class AuthorizationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new nodelambda.NodejsFunction(this, 'BasicAuth', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: 'basicAuthorizer',
      functionName: 'basicAuthorizer',
      entry: path.join(__dirname, '../functions/basicAuthorizer.ts'),
      environment: {
        AUTH_GITHUB_DEFAULT_USERNAME: Config.AUTH_GITHUB_DEFAULT_USERNAME,
        AUTH_GITHUB_DEFAULT_PASSWORD: Config.AUTH_GITHUB_DEFAULT_PASSWORD,
      },
    });
  }
}
