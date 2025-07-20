import { FastifyInstance } from "fastify";
import { TournamentIdSchema, TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../classes/errors/error";
import { Parameters, Type } from "@sinclair/typebox";
import { HistorySchema } from "../../schemas/HistorySchema";
import { ToStatic } from "../../../types/ToStatic";
import { DIContainer } from "../../../classes/DIContainer";
import { HistoryDTO } from "../../../../application/dto/HistoryDTO";
import { HistoryDTO2JSON } from "../../classes/HistoryDTO2JSON";
import { ExternalIdHeaderSchema } from "../../schemas/headers/ExternalIdHeaderSchema";
import { MediatorTokenHeaderSchema } from "../../schemas/headers/MediatorTokenHeaderSchema";

const description = `
> 廃止予定です。 /tournaments/{id}/battle/end を使用してください。

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
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Pick(HistorySchema(), ['winner', 'loser']),
	Headers: Type.Intersect([
		MediatorTokenHeaderSchema()
	]),
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
	fastify.post<RouteSchemaType>('/tournaments/:id/histories', {
		schema: {
			description,
			tags: ["histories"],
			summary: "対戦結果作成",
			body: RouteSchema.Body,
			headers: RouteSchema.Headers,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();
		const historyDTO = await appService.createHistory({
			tournament_id: request.params.id,
			loser: {
				id: request.body.loser.id,
				score: request.body.loser.score,
			},
			winner: {
				id: request.body.winner.id,
				score: request.body.winner.score,
			},
			appMediator: {
				mediatorToken: request.headers["x-mediator-token"]
			}
		});
		reply.status(200).send(HistoryDTO2JSON.toJSON(historyDTO));
	})
}
