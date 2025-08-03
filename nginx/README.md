# Nginx Configuration with SSL

このディレクトリには、FT_TRANSCENDENCEプロジェクトのnginxリバースプロキシ設定が含まれています。

## 構成

- `nginx.conf` - メインのnginx設定ファイル
- `conf.d/default.conf` - サーバーブロックとSSL設定
- `ssl/` - SSL証明書ディレクトリ
  - `certificate.pem` - SSL証明書
  - `private-key.pem` - 秘密鍵

## 機能

### SSL/TLS設定
- 自己署名証明書を使用したHTTPS通信
- HTTPからHTTPSへの自動リダイレクト
- セキュリティヘッダーの設定
- HTTP/2の有効化

### リバースプロキシ
- フロントエンド: `/` → `frontend:3000`
- API: `/api/` → `gateway:8000`
- 認証: `/auth/` → `auth:3001`
- トーナメント: `/tournament/` → `tournament:8080`
- ゲームWebSocket: `/game/` → `game:4000`

### セキュリティ機能
- レート制限（API: 10r/s, ログイン: 5r/s）
- セキュリティヘッダー
- Gzip圧縮
- アクセスログ

## 使用方法

### 開発環境での起動
```bash
# 全サービスを起動（nginx含む）
docker-compose up

# アクセス
# HTTP: http://localhost → HTTPS: https://localhost にリダイレクト
# HTTPS: https://localhost
```

### SSL証明書の更新
```bash
# 新しい自己署名証明書を生成
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/private-key.pem \
  -out nginx/ssl/certificate.pem \
  -subj "/C=JP/ST=Tokyo/L=Tokyo/O=FT_TRANSCENDENCE/OU=Development/CN=localhost"

# 権限設定
chmod 600 nginx/ssl/private-key.pem
chmod 644 nginx/ssl/certificate.pem
```

### 設定テスト
```bash
./nginx/test-config.sh
```

## 注意事項

- 開発環境では自己署名証明書を使用しています
- 本番環境では、Let's Encryptなどの正式な証明書を使用してください
- ブラウザで自己署名証明書の警告が表示される場合があります
- 本番環境では、適切なドメイン名を設定してください 
