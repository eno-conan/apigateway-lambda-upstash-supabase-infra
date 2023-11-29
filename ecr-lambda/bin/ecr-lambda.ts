#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrLambdaStack } from '../lib/ecr-lambda-stack';

const app = new cdk.App();
new EcrLambdaStack(app, 'EcrLambdaStack');
