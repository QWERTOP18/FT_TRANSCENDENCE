import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
:idで指定されたマッチを終了します。
statusがin_progressのときに、statusをdoneに変更します。

# 注意点
* 開始していないマッチは終了できません。
* 必ずloserとwinnerの両方を指定する必要があります。
`

export function DoneMatchRoute(fastify: FastifyInstance) {
	fastify.put('/matches/:id/done', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチ終了",
			body: Type.Pick(MatchSchema(), ['loser', 'winner']),
			response: {
				200: OKSchema(),
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
