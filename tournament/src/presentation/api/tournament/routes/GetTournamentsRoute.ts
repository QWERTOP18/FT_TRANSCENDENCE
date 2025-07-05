import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";

const description = `
# 概要
トーナメント一覧を取得します。

# 注意点
`

export function GetTournamentsRoute(fastify: FastifyInstance) {
	fastify.get('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント一覧取得",
			response: {
				200: Type.Array(TournamentSchema(), { description: "OK" })
			}
		}
	}, () => {
		throw NotImplementedError();
	})
}
