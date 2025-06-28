import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";

const description = `
# 概要
:idで指定されたトーナメントのidで、statusがreadyであるマッチのうち最もorderが小さいマッチを取得します。

# 注意点
`

export function GetNextMatchRoute(fastify: FastifyInstance) {
	fastify.get('/matches/:id/next', {
		schema: {
			description,
			tags: ["match"],
			summary: "トーナメントで行う次のマッチを取得",
			response: {
				200: MatchSchema({ description: "OK" })
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
