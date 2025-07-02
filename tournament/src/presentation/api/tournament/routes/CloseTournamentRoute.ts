import { FastifyInstance } from "fastify";
import { OKSchema } from "../../schemas/OtherSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
開催中のトーナメントを終了します。
stateをcloseに変更します。

# 注意点
* championが決まっていない場合でも、強制的に終了します。
* in_progressの参加者がいる場合は、closeできません。
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
