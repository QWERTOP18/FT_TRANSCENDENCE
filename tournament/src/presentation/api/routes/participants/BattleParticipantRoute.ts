import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { UsageError } from "../../classes/errors/error";
import { OKJson } from "../../json/OKJson";
import { OKSchema } from "../../schemas/OtherSchema";
import { ParticipantIdSchema } from "../../schemas/ParticipantSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";
import { MediatorTokenHeaderSchema } from "../../schemas/headers/MediatorTokenHeaderSchema";

const description = `
> 廃止予定です。 /tournaments/{id}/battle/start を使用してください。

# 概要
複数の参加者のステータスをin_progressにします。
参加者はready状態の2人指定する必要があります。

# 注意点
 * stateがreadyの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`

const RouteSchema = {
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Array(ParticipantIdSchema()),
	Headers: Type.Intersect([
		MediatorTokenHeaderSchema()
	]),
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

export function BattleParticipantRoute(fastify: FastifyInstance) {
	fastify.put<RouteSchemaType>('/tournaments/:id/participants/battle', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者のステータスをin_progressにする",
			headers: RouteSchema.Headers,
			params: RouteSchema.Params,
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		if (request.body.length !== 2)
			throw new UsageError();
		await appService.battleParticipant({
			tournamentId: request.params.id,
			firstParticipantId: request.body[0],
			secondParticipantId: request.body[1],
			appMediator: {
				mediatorToken: request.headers["x-mediator-token"]
			}
		});
		reply.status(200).send(OKJson);
	})
}
