import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

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

    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
    });

    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getAllFunction));

    const productByIdResource = productsResource.addResource('{id}');
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getOneFunction));
  }
}
