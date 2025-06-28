import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";

const description = `
# 概要
マッチ一覧を取得します。

# 注意点
`

export function GetMatchesRoute(fastify: FastifyInstance) {
	fastify.get('/matches', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチ取得",
			response: {
				200: Type.Array(MatchSchema(), { description: "OK" })
			}
		}
	}, () => {
		throw NotImplementedError();
	})
}
