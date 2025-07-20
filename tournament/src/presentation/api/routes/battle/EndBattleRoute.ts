import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { OKJson } from "../../json/OKJson";
import { HistorySchema } from "../../schemas/HistorySchema";
import { OKSchema } from "../../schemas/OtherSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";

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

// TODO: HistoryからBattleSchemaに変更すること。
const RouteSchema = {
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Pick(HistorySchema(), ['winner', 'loser']),
	Headers: undefined,
	Reply: {
		200: OKSchema(),
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

export function EndBattleRoute(fastify: FastifyInstance) {
	fastify.post<RouteSchemaType>('/tournaments/:id/battle/end', {
		schema: {
			description,
			tags: ["battle"],
			summary: "対戦終了",
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();
		// TODO: ここでサービスを作って呼び出す。
		reply.status(200).send(OKJson);
	})
}
