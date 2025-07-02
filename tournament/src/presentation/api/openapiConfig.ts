

const apiDescription = `
トーナメント表を作成するためのAPI
### インストール
準備中。。。
\`\`\`
docker-compose up -d
\`\`\`
で起動できるようにする予定。

### 使い方
1. [POST] \`tournaments\`でトーナメントを作成する。
1. [POST] \`participants\`で参加者を追加する。
1. [POST] \`tournaments/:id/open\`でトーナメントを開始する。
1. [GET] \`tournaments/:id\`で適宜トーナメントを取得する。
1. [POST] \`match/:id/done\`で対戦結果を登録するを進める。
1. [POST] \`tournament/close\`でトーナメントを閉じる。

### 共通エラー
何かしらのエラーが発生した場合以下のエラーが発生する可能性があります。

#### パラメータ
エラーレスポンスでは以下のパラメータを必ず含みます。
 * statusCode : ステータスコード : number
 * code : エラーコード : string
 * error : statusCodeに基づくエラーメッセージ : string
 * message : 詳細なエラーメッセージ : string

#### レスポンス例
\`\`\`
{
	"statusCode":500,
	"code":"TRT_ERR_NOT_IMPLEMENTED",
	"error":"Internal Server Error",
	"message":"This feature is not implemented."
}
\`\`\`

#### エラーコード一覧

 > 基本的なエラーコードは [Fastify](https://fastify.dev/docs/v5.3.x/Reference/Errors/) で定義されています。

 以下はこのシステムで更に定義されているものです。

 | Code | Description | How to solve |
 | --- | :---: | :---: |
 | TRT_ERR_NOT_IMPLEMENTED | This feature is not implemented | Please contact this server maintainer |

### ドキュメンテーションパス
 * \`/documentation\` : このページ
 * \`/documentation/json\` : このページを生成するための生のopenapi.json

`

export const openapiConfig = {
	openapi: '3.0.0',
	info: {
		title: 'トーナメントAPI',
		description: apiDescription,
		version: '0.0.0',
	},
	tags: [
		{ name: 'tournament', description: 'トーナメントに関するAPI' },
		{ name: 'histories', description: '対戦結果に関するAPI' },
		{ name: 'participant', description: '参加者に関するAPI' },
	]
};
