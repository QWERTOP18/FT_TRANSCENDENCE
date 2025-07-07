#!/bin/bash

# 以下はコメントです。スクリプトの目的と実行内容を説明します。
<<"EOF"
コメントフォーマット: markdown

# 目的
開発環境のセットアップと起動を行うスクリプトです。

# 開発環境のセットアップ 凡例:
 1. prismaクライアントの生成 => `npx prisma generate`
 2. バックグラウンドでの起動 => `ts-node-dev src/index.ts`

EOF

function main() {
  migrate
	generate_prisma_client
	start_dev_server &
	wait "$!"
}

function migrate() {
  echo "Generating database..."
  npx prisma migrate dev
}

function generate_prisma_client() {
  echo "Running Prisma generate..."
  npx prisma generate
}

function start_dev_server() {
  echo "Starting development server..."
  ts-node-dev src/index.ts
}

main "$@"
