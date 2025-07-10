import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../classes/errors/error";
import { Parameters, Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";
import { ToStatic } from "../../../types/ToStatic";
import { DIContainer } from "../../../classes/DIContainer";
import { HistoryDTO } from "../../../../application/dto/HistoryDTO";
import { HistoryDTO2JSON } from "../../classes/HistoryDTO2JSON";

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

const RouteSchema = {
	Params: undefined,
	Querystring: undefined,
	Body: Type.Pick(HistorySchema(), ['tournament_id', 'winner', 'loser']),
	Headers: undefined,
	Reply: {
		200: HistorySchema({ description: "OK" }),
	}
} as const;

type RouteSchemaType = {
	Params: ToStatic<typeof RouteSchema.Params>,
	Querystring: ToStatic<typeof RouteSchema.Querystring>,
	Body: ToStatic<typeof RouteSchema.Body>,
	Headers: ToStatic<typeof RouteSchema.Headers>,
	Reply: {
		200: ToStatic<typeof RouteSchema.Reply[200]>
	};
}

export function CreateHistoryRoute(fastify: FastifyInstance) {
	fastify.post<RouteSchemaType>('/histories', {
		schema: {
			description,
			tags: ["histories"],
			summary: "対戦結果作成",
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();
		const historyDTO = await appService.createHistory({
			tournament_id: request.body.tournament_id,
			loser: {
				id: request.body.loser.id,
				score: request.body.loser.score,
			},
			winner: {
				id: request.body.winner.id,
				score: request.body.winner.score,
			},
		});
		reply.status(200).send(HistoryDTO2JSON.toJSON(historyDTO));
	})
}
