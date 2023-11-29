# apigateway-lambda-upstash-supabase-infra

### 詳細について
- [詳細はこちらの記事で公開しています。](https://qiita.com/eno49conan/items/6d3e98df2ac82613c3b3)

### フォルダ構成の説明
- ecr-lambda/
  - FastAPIのアプリケーションのイメージ配置のリポジトリ作成用コード。こちらを先に構築します。
- serverless-app/
  - APIGateway、Lambda関数、IAMロール、SecretManagerのリソース作成用コード

### スタックの反映
```bash
cdk deploy
```