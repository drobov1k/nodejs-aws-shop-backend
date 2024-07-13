#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AuthorizationStack } from '../lib/authorization-stack';

const app = new cdk.App();
new AuthorizationStack(app, 'AuthorizationStack');
