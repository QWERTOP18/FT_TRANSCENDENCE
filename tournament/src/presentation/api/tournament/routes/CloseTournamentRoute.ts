import { FastifyInstance } from "fastify";
import { OKSchema } from "../../schemas/OtherSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
開催中のトーナメントを終了します。

# 注意点
* 受付中のトーナメントも終了されます。
`

export function CloseTournamentRoute(fastify: FastifyInstance) {
	fastify.post('/tournaments/:id/close', {
		schema: {
			description: description,
			tags: ["tournament"],
			summary: "トーナメントを終了する",
			response: {
				200: OKSchema()
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
