import {
  Stack,
  StackProps,
  aws_apigateway as apigateway,
  SecretValue,
  aws_secretsmanager as secretManager
} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dotenv from 'dotenv';
import { Construct } from 'constructs';

dotenv.config();
export class ServerlessAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ECRリポジトリの定義
    const appEcrRepository = ecr.Repository.fromRepositoryName(this, 'fastapiAppRepository', 'fastapi-lambda-repo');

    // 機密情報の管理
    const secretUpstashPassword = new secretManager.Secret(this, 'UpstashRedisRestPassword', {
      secretName: 'upstash-redis-rest-password',
      secretStringValue: SecretValue.unsafePlainText(process.env.UPSTASH_REDIS_REST_PASSWORD!),
    });

    const secretSupabaseKey = new secretManager.Secret(this, 'SupabaseKey', {
      secretName: 'supabase-key',
      secretStringValue: SecretValue.unsafePlainText(process.env.SUPABASE_KEY!),
    });

    const fastApiLambdaRole = new iam.Role(this, 'FastApiLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'FastApiLambdaRole'
    });

    // アプリケーション用のLambda関数
    const fastApiappLambda = new lambda.Function(this, "fastapi-sample-container-lambda", {
      code: lambda.Code.fromEcrImage(appEcrRepository, {
        cmd: ["src.main.handler"],
        tag: "latest",
      }),
      functionName: "fastapi-sample-container-lambda",
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
      timeout: cdk.Duration.seconds(30),
      // layers: [powerToolsLayer],
      environment: {
        ENV: 'dev',
        TITLE: 'FastAPI-MyApp',
        UPSTASH_REDIS_REST_HOST: process.env.UPSTASH_REDIS_REST_HOST!,
        UPSTASH_REDIS_REST_PORT: process.env.UPSTASH_REDIS_REST_PORT!,
        SUPABASE_URL: process.env.SUPABASE_URL!,
      },
      role: fastApiLambdaRole,
    });

    // ポリシーの設定
    fastApiappLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['secretsmanager:GetSecretValue'],
      resources: [
        secretUpstashPassword.secretArn,
        secretSupabaseKey.secretArn
      ],
    }));

    fastApiappLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['arn:aws:logs:*:*:*'],
    }));

    const nameRestApi = "Rest API with Lambda";
    const restApi = new apigateway.RestApi(this, nameRestApi, {
      restApiName: `FastAPIGateway`,
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'dev',
      },
    });

    restApi.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(fastApiappLambda),
      anyMethod: true,
      defaultMethodOptions: { apiKeyRequired: true },
    });

    // api key:valueをシークレットにする方法
    const apiKey = restApi.addApiKey("fastapiAppApiKey", {
      apiKeyName: `fastapiApp-apiKey`,
      // value: ""
    }); // APIキーの値は未指定で自動作成

    // 使用量プラン
    const usagePlan = restApi.addUsagePlan("sampleApiUsagePlan", {
      name: 'MyUsagePlan',
      description: 'My API Usage Plan',
      throttle: {
        rateLimit: 50, // スロットリングのレート制限（リクエスト数）
        burstLimit: 100, // スロットリングのバースト制限（一度に許可される最大リクエスト数）
      },
      quota: {
        limit: 1000, // クォータの制限（リクエスト数）
        period: apigateway.Period.WEEK, // クォータの期間（MONTH, WEEK, DAY）
      },
    });
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      stage: restApi.deploymentStage
    });
  }
}
