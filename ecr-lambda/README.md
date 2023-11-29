# Welcome to your CDK TypeScript project
https://dev.classmethod.jp/articles/aws-cdk-v2-create-ecr-repo-push-image-execute-on-lambda/
### HealthCheck
https://gist.github.com/Jarmos-san/0b655a3f75b698833188922b714562e5
### Log Filtering
https://www.takapy.work/entry/2023/07/31/181315

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`EcrLambdaStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
