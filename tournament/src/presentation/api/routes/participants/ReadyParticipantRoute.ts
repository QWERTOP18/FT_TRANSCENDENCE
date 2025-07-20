import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { OKJson } from "../../json/OKJson";
import { ExternalIdHeaderSchema } from "../../schemas/headers/ExternalIdHeaderSchema";
import { OKSchema } from "../../schemas/OtherSchema";
import { ParticipantIdSchema } from "../../schemas/ParticipantSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
参加者のステータスをreadyにします。

# 権限
 *

# 注意点
 * sateがpendingの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`

const RouteSchema = {
	Params: Type.Object({
		participant_id: ParticipantIdSchema(),
		tournament_id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: undefined,
	Headers: Type.Intersect([
		ExternalIdHeaderSchema()
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

export function ReadyParticipantRoute(fastify: FastifyInstance) {
	fastify.put<RouteSchemaType>('/tournaments/:tournament_id/participants/:participant_id/ready', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者のステータスをreadyにする",
			headers: RouteSchema.Headers,
			params: RouteSchema.Params,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		await appService.readyParticipant({
			participantId: request.params.participant_id,
			tournamentId: request.params.tournament_id,
			appUser: {
				externalId: request.headers["x-external-id"]
			}
		});
		reply.status(200).send(OKJson)
	})
}
