

const apiDescription = `
トーナメント表を作成するためのAPI
### インストール
準備中。。。
\`\`\`
docker-compose up -d
\`\`\`
で起動できるようにする予定。

### 使用例
1. [POST] \`tournaments\`でトーナメントを作成する。
1. [POST] \`participants\`で参加者を追加する。
1. [POST] \`tournaments/:id/open\`でトーナメントを開始する。
1. [PUT] \`participants/:id/ready\`で参加者をreadyにする。
1. [PUT] \`participants/:id/cancel\`で参加者をpendingにする。
1. [PUT] \`participants/:id/battle\`で参加者をin_progressにする。
1. [POST] \`history\`で対戦結果を保存する。
1. 参加者が一人になるまで、4, 5, 6を繰り返す。
1. 一人になると、自動で終了。

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

 | コード | 説明 | 解決法 |
 | --- | :---: | :---: |
 | TRT_ERR_NOT_IMPLEMENTED | この機能は実装されていません | 管理者に連絡してください |

### ドキュメンテーションパス
 * \`/documentation\` : このページ
 * \`/documentation/json\` : このページを生成するための生のopenapi.json
 * \`/documentation/yaml\` : このページを生成するための生のopenapi.yaml

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
