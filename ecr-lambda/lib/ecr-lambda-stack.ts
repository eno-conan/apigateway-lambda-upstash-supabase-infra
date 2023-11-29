import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from 'constructs';

export class EcrLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ECRレポジトリ：アプリケーション用
    new ecr.Repository(this, 'appLambdaRepository', {
      repositoryName: "fastapi-lambda-repo",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true
    });
  }
}
