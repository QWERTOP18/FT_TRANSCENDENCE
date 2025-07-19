import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { OKJson } from "../../json/OKJson";
import { HistoryIdSchema } from "../../schemas/HistorySchema";
import { OKSchema } from "../../schemas/OtherSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
in_progressのユーザー2名をreadyに戻す。

# 注意点
 * close状態のトーナメントでは作成できません。
`

const RouteSchema = {
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Array(HistoryIdSchema(), { minItems: 2, maxItems: 2 }),
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
		const appService = DIContainer.applicationService();
		// TODO: ここでサービスを作って呼び出す。
		reply.status(200).send(OKJson);
	})
}
