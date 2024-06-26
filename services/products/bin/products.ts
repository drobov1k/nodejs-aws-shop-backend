// #!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsStack } from '../lib/products-stack';

const app = new cdk.App();
new ProductsStack(app, 'ProductsStack');
