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
  db_push
	generate_prisma_client
  prisma_seed
	start_dev_server &
	wait "$!"
}

function db_push() {
  echo "Generating database..."
  npx prisma db push
}

function generate_prisma_client() {
  echo "Running Prisma generate..."
  npx prisma generate
}

function prisma_seed() {
  echo "Create seed..."
  npx prisma db seed
}

function start_dev_server() {
  echo "Starting development server..."
  tsx watch --clear-screen=false src/index.ts
}

main "$@"
