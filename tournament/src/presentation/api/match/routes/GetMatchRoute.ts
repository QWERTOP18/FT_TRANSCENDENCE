import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";

const description = `
# 概要
:idで指定されたマッチを取得します。

# 注意点
`

export function GetMatchRoute(fastify: FastifyInstance) {
	fastify.get('/matches/:id', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチ取得",
			response: {
				200: MatchSchema({ description: "OK" })
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
