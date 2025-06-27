import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";

const description = `
# 概要
:idで指定されたトーナメントを取得します。

# 注意点
`

export function GetTournamentRoute(fastify: FastifyInstance) {
	fastify.get('/tournaments/:id', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント取得",
			response: {
				200: TournamentSchema({ description: "OK" })
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
