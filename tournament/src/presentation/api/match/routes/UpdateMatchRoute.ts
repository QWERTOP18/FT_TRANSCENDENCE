import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";

const description = `
# 概要
:idで指定されたマッチを更新します。

# 注意点
* ！！！！！使えません！！！！！
`

export function UpdateMatchRoute(fastify: FastifyInstance) {
	fastify.put('/matches/:id', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチを更新します",
			response: {
				200: MatchSchema({ description: "NG" })
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
