import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';

import * as path from 'path';

import { HttpMethod } from '../../../core/helpers';
import Config from '../../../config';
import { setEnvVars } from './env-vars';

export class ProductsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getOneFunction = new nodelambda.NodejsFunction(this, 'GetByIdFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'getProductsById',
      entry: path.join(__dirname, '../functions/getProductsById.ts'),
    });

    const getAllFunction = new nodelambda.NodejsFunction(this, 'GetAllFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'getProductsList',
      entry: path.join(__dirname, '../functions/getProductsList.ts'),
    });

    const createFunction = new nodelambda.NodejsFunction(this, 'CreateFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'createProduct',
      entry: path.join(__dirname, '../functions/createProduct.ts'),
    });

    const catalogBatchFunction = new nodelambda.NodejsFunction(this, 'CatalogBatch', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'catalogBatchProcess',
      entry: path.join(__dirname, '../functions/catalogBatchProcess.ts'),
    });

    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: [HttpMethod.Get, HttpMethod.Post, HttpMethod.Options],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
      },
    });

    const productTable = new dynamodb.Table(this, 'ProductTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'products',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const stocksTable = new dynamodb.Table(this, 'StockTable', {
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      tableName: 'stocks',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    productTable.grantReadData(getAllFunction);
    productTable.grantReadData(getOneFunction);
    productTable.grantWriteData(createFunction);
    productTable.grantWriteData(catalogBatchFunction);

    stocksTable.grantReadData(getAllFunction);
    stocksTable.grantReadData(getOneFunction);
    stocksTable.grantWriteData(createFunction);
    stocksTable.grantWriteData(catalogBatchFunction);

    [getAllFunction, getOneFunction, createFunction, catalogBatchFunction].forEach((fn) =>
      setEnvVars(fn, [
        { key: 'DYNAMODB_PRODUCTS_TABLE', value: productTable.tableName },
        { key: 'DYNAMODB_STOCKS_TABLE', value: stocksTable.tableName },
        { key: 'UI_URL', value: Config.UI_URL },
      ]),
    );

    catalogBatchFunction.addEnvironment('PRODUCT_SNS_TOPIC_ARN', Config.PRODUCT_SNS_TOPIC_ARN);

    const productsResource = api.root.addResource('products');
    productsResource.addMethod(HttpMethod.Get, new apigateway.LambdaIntegration(getAllFunction));
    productsResource.addMethod(HttpMethod.Post, new apigateway.LambdaIntegration(createFunction));

    const productByIdResource = productsResource.addResource('{id}');
    productByIdResource.addMethod(HttpMethod.Get, new apigateway.LambdaIntegration(getOneFunction));

    const productQueue = new sqs.Queue(this, 'ProductQueue', {
      queueName: Config.PRODUCT_SQS_QUEUE,
    });
    catalogBatchFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(productQueue, {
        batchSize: +Config.PRODUCT_SQS_QUEUE_BATCH_SIZE,
      }),
    );

    const publisher = new sns.Topic(this, 'CreateProductTopic', {
      topicName: Config.PRODUCT_SNS_TOPIC,
    });
    publisher.addSubscription(new subs.EmailSubscription(Config.PRODUCT_SNS_SUBSCRIBER_EMAIL));
    publisher.grantPublish(catalogBatchFunction);
  }
}
