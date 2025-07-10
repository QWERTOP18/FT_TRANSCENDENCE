# ゲームサービス（Pong）

このサービスはPong風のリアルタイム対戦ゲームのバックエンドです。

## 起動方法

1. 依存パッケージのインストール

```
npm install
```

2. サーバの起動

```
npm run start
```

デフォルトではポート4000番で起動します。

## API・WebSocketの使い方

### 1. 部屋作成API

- `POST /room` で新しいゲームルームを作成できます。
- レスポンス例:

```
{
  "room_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "token_player1": "...",
  "token_player2": "...",
  "token_watcher": "..."
}
```

### 2. WebSocket

- 取得した `room_id` を使い、`ws://localhost:4000/game/<room_id>` でWebSocket接続します。
- 最初の2クライアントがプレイヤー1・2として割り当てられます。
- 3人目以降は観戦者として扱われます（今後拡張予定）。
- ルームが存在しない場合は接続できません。

#### メッセージ例

- キーイベント送信:

```
{
  "type": "keyEvent",
  "key": "w", // または "s", "ArrowUp", "ArrowDown"
  "pressed": true // または false
}
```

- サーバからのゲーム状態通知:

```
{
  "type": "gameState",
  "state": {
    "paddle1Y": 250,
    "paddle2Y": 250,
    "ballX": 400,
    "ballY": 300,
    "score1": 0,
    "score2": 0,
    "end": false,
    "error": 0,
    "roomId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### 3. Fastify API

- `/ping` : サーバの疎通確認用エンドポイント
- `/docs` : OpenAPI (Swagger UI) ドキュメント

## 設計・補足

- **ルーム管理・WebSocket処理**は `src/presentation/gateway/GameGateway.ts` で一元管理されています。
- **ゲームルームの状態**は `src/domain/GameRoom.ts` で管理されます。
- **ゲーム進行ロジック**は `src/domain/GameState.ts` に実装されています。
- **APIルート**は `src/presentation/api/` 以下に実装されています。
- ルーム作成APIは `GameGateway` を通じてルームを生成します。
- ルームが存在しない場合、WebSocket接続は拒否されます。
- 今後、観戦者機能や認証・トークンチェックなども拡張予定です。
