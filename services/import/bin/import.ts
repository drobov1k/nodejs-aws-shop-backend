#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ImportStack } from '../lib/import-stack';

const app = new cdk.App();
new ImportStack(app, 'ImportStack');
