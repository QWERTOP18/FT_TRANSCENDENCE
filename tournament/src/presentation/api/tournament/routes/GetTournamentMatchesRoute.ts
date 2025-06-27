import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { MatchSchema } from "../../schemas/MatchSchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";

const description = `
# 概要
トーナメントのマッチ一覧を取得します。

# 注意点
* マッチは追加ができず、参加者を追加することで自動で作成されます。
`

export function GetTournamentMatchesRoute(fastify: FastifyInstance) {
	fastify.post('/tournaments/:id/matches', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントのマッチを取得する",
			response: {
				200: Type.Array(MatchSchema(), { description: "トーナメントのマッチ" })
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
