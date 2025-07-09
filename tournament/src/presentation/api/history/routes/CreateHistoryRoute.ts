import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";

const description = `
# 概要
対戦結果を作成します。
対戦結果を作成すると、各参加者は以下のステータスになります。

loserのstateはeliminatedになります。

winnerのstateは、battledになります。
ただし、条件によっては、次の表のように変更されます。

| 条件 | 次のstate |
| --- | --- |
| 自分以外の全参加者がeliminatedになった場合 | champion |
| 全参加者のstateがeliminatedもしくはbattledになった場合 | battledの参加者はpendingになります。 |

pendingの参加者が奇数の場合はランダムで、一人だけstateがbattledになります。

また、championが決まった場合は、トーナメントのstateをcloseに変更します。

# 注意点
 * close状態のトーナメントでは作成できません。
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
		throw new NotImplementedError();
	})
}
