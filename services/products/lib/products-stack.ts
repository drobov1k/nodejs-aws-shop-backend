import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

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

    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
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

    stocksTable.grantReadData(getAllFunction);
    stocksTable.grantReadData(getOneFunction);
    stocksTable.grantWriteData(createFunction);

    [getAllFunction, getOneFunction, createFunction].forEach((fn) =>
      setEnvVars(fn, [
        { key: 'DYNAMODB_PRODUCTS_TABLE', value: productTable.tableName },
        { key: 'DYNAMODB_STOCKS_TABLE', value: stocksTable.tableName },
        { key: 'UI_URL', value: Config.UI_URL },
      ]),
    );

    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getAllFunction));
    productsResource.addMethod('POST', new apigateway.LambdaIntegration(createFunction));

    const productByIdResource = productsResource.addResource('{id}');
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getOneFunction));
  }
}
