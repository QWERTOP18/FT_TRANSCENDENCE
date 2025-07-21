import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { OKJson } from "../../json/OKJson";
import { HistoryIdSchema } from "../../schemas/HistorySchema";
import { OKSchema } from "../../schemas/OtherSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";
import { ParticipantIdSchema } from "../../schemas/ParticipantSchema";

const description = `
# 概要
in_progressのユーザー2名を in_progress に戻す。

# 注意点
 * close状態のトーナメントでは使用できません。
 * /tournaments/{id}/battle/start で使用した参加者IDの組み合わせでなくても動作します。
`

const RouteSchema = {
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Array(ParticipantIdSchema(), { minItems: 2, maxItems: 2 }),
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

export function CancelBattleRoute(fastify: FastifyInstance) {
	fastify.put<RouteSchemaType>('/tournaments/:id/battle/cancel', {
		schema: {
			description,
			tags: ["battle"],
			summary: "対戦を取り消す",
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const battleService = DIContainer.battleService();
		await battleService.cancelBattle({
			tournamentId: request.params.id,
			firstParticipantId: request.body[0],
			secondParticipantId: request.body[1],
		});
		reply.status(200).send(OKJson);
	})
}
