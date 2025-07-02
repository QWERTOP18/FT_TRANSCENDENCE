import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";

const description = `
# 概要
対戦結果を作成します。

# 注意点
 * 対戦結果を作成すると、各参加者は以下のステータスになります。
	* loserのステータスはeliminatedになります。
	* winnerのステータスは、battledになります。
	ただし、自分以外の全参加者がeliminatedになった場合に、championになります。
	championができる場合、tournamentのstateはcloseになります。
 	* 全参加者のステータスがeliminatedもしくはbattledになった場合は、battledの参加者はpendingになります。
	* ただし、battled->pendingの時、battledの参加者が奇数の場合はランダムで、一人battledに残ります。
`

export function CreateHistoryRoute(fastify: FastifyInstance) {
	fastify.post('/histories', {
		schema: {
			description,
			tags: ["histories"],
			summary: "対戦結果作成",
			body: Type.Pick(HistorySchema(), ['tournament_id', 'winner', 'loser']),
			response: {
				200: HistorySchema({ description: "OK" })
			}
		}
	}, () => {
		throw NotImplementedError();
	})
}
