# Gateway Endpoint Testing

このドキュメントでは、gatewayサービスのendpointをテストする方法を説明します。

## 前提条件

1. Docker Composeでサービスが起動していること
2. 必要な依存関係がインストールされていること

## テスト方法

### 1. 手動テスト（HTTPファイル）

VS CodeのREST Client拡張機能を使用してテストできます：

```bash
# test-endpoints.httpファイルをVS Codeで開く
code test-endpoints.http
```

各リクエストの横にある「Send Request」ボタンをクリックしてテストを実行できます。

### 2. シェルスクリプトでのテスト

```bash
# スクリプトを実行
./test-endpoints.sh
```

### 3. Jestでの自動化テスト

```bash
# 依存関係をインストール
npm install

# テストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジ付きでテストを実行
npm run test:coverage
```

## 利用可能なEndpoints

### Auth Endpoints

- `POST /auth/signup` - ユーザー作成
- `POST /auth/authenticate` - ユーザー認証

### Tournament Endpoints

- `GET /tournaments` - トーナメント一覧取得
- `GET /tournaments/:id` - 特定のトーナメント取得
- `POST /tournaments` - トーナメント作成
- `POST /tournaments/:id/open` - トーナメント開始
- `GET /tournaments/:id/participants` - トーナメント参加者取得
- `POST /tournaments/:id/join` - トーナメント参加

### Battle Endpoints

- `POST /battle/ready` - バトル準備
- `POST /battle/cancel` - バトルキャンセル
- `POST /battle/ai-opponent` - AI対戦

### Utility Endpoints

- `GET /` - Swagger UI にリダイレクト
- `GET /docs` - Swagger UI
- `GET /ping` - ヘルスチェック

## テストデータ

テストでは以下のデータを使用します：

### ユーザー作成

```json
{
  "name": "testuser"
}
```

### トーナメント作成

```json
{
  "name": "Test Tournament",
  "description": "A test tournament",
  "maxParticipants": 8,
  "rules": {
    "winningScore": 10,
    "timeLimit": 300
  }
}
```

### トーナメント参加

```json
{
  "userId": "user-id"
}
```

### バトル準備

```json
{
  "userId": "user-id",
  "tournamentId": "tournament-id"
}
```

### AI対戦

```json
{
  "userId": "user-id",
  "aiLevel": 1
}
```

## トラブルシューティング

### 接続エラーが発生する場合

1. サービスが起動しているか確認：

   ```bash
   docker-compose ps
   ```

2. ログを確認：

   ```bash
   make logs-gateway
   ```

3. サービスを再起動：
   ```bash
   make restart
   ```

### 認証エラーが発生する場合

1. authサービスが正常に動作しているか確認
2. 環境変数`AUTH_URL`が正しく設定されているか確認

### トーナメントエラーが発生する場合

1. tournamentサービスが正常に動作しているか確認
2. データベースが初期化されているか確認：
   ```bash
   make tournament-prisma-reset
   ```

## Swagger UI

APIドキュメントは以下のURLで確認できます：

- http://localhost:8000/docs

これにより、各endpointの詳細な仕様とテストをブラウザ上で実行できます。
