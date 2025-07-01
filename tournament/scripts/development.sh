#!/bin/bash

# 以下はコメントです。スクリプトの目的と実行内容を説明します。
<<"EOF"
コメントフォーマット: markdown

# 目的
開発環境のセットアップと起動を行うスクリプトです。

# 開発環境のセットアップ 凡例:
 1. prismaクライアントの生成 => `npx prisma generate --schema=src/infrastructure/SQLite/prisma/schema.prisma`
 2. バックグラウンドでの起動 => `ts-node-dev src/index.ts`

EOF

function main() {
	generate_prisma_client
	start_dev_server &
	wait "$!"
}

function generate_prisma_client() {
  echo "Running Prisma generate..."
  npx prisma generate --schema=src/infrastructure/SQLite/prisma/schema.prisma
}

function start_dev_server() {
  echo "Starting development server..."
  ts-node-dev src/index.ts
}

main "$@"
