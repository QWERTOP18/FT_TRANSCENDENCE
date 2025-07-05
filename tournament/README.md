# Tournament API

# Docker compose
 プロジェクトルートにあるdocker-compose.ymlは、基本的にドキュメントやAPIモック用です。
 .devcontainerにあるdocker-compose.ymlは開発用です。

# コントリビュータへ

## ドキュメント
 * `docs/openapi.json`は`npm run download-json`で取得しています。

## 開発にあたって
 `npm run dev`してください。
 現在のコードと開発環境の整合性を取り、変更が環境に適応されます。
 詳しい実行内容は、実行しているスクリプトファイルの上部を確認してください。

 > WindowsやWSL上の場合うまく変更が検知されない場合があります。(VSCode内のターミナルだけだったかどうかは忘れました)
