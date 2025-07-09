import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { HistorySchema } from "../../schemas/HistorySchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
トーナメントの対戦結果を取得します。

# 注意点
`

export function GetTournamentHistoryRoute(fastify: FastifyInstance) {
	fastify.get('/tournaments/:id/histories', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントの対戦結果を取得する",
			response: {
				200: Type.Array(HistorySchema(), { description: "トーナメントの対戦結果" })
			},
			params: Type.Pick(TournamentSchema(), ['id']),
		}
	}, () => {
		throw new NotImplementedError();
	})
}
