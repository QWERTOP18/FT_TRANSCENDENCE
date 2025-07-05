import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";

const description = `
# 概要
トーナメントの参加者を取得します。

# 注意点
`

export function GetTournamentParticipantsRoute(fastify: FastifyInstance) {
	fastify.get('/tournaments/:id/participants', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントの参加者を取得する",
			response: {
				200: Type.Array(ParticipantSchema(), { description: "トーナメント参加者" })
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
