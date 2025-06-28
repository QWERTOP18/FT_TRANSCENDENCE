import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
:idで指定されたマッチを削除します。

# 注意点
`

export function DeleteMatchRoute(fastify: FastifyInstance) {
	fastify.delete('/matches/:id', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチ削除",
			response: {
				200: OKSchema()
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
