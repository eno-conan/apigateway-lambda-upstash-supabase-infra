# apigateway-lambda-upstash-supabase-infra

### 詳細について
- [詳細はこちらの記事で公開しています。]()

### フォルダ構成の説明
- ecr-lambda/
  - FastAPIのアプリケーションのイメージを配置するためのリポジトリ作成用コード。こちらを先に構築する必要があります。
- serverless-app/
  - APIGateway,Lambda関数

### アプリケーション起動（ローカル環境）
```bash
uvicorn src.main:app --reload
```