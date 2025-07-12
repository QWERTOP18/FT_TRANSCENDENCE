import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { ParticipantDTO2JSON } from "../../classes/ParticipantDTO2JSON";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { TournamentIdSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
参加者を作成します。

# 注意点
 * トーナメントがreceptionの時のみ、参加者を作成できます。
`

const RouteSchema = {
	Params: Type.Object({
		id: TournamentIdSchema(),
	}),
	Querystring: undefined,
	Body: Type.Pick(ParticipantSchema(), ['external_id']),
	Headers: undefined,
	Reply: {
		200: ParticipantSchema({ description: "OK" }),
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

export function CreateParticipantRoute(fastify: FastifyInstance) {
	fastify.post<RouteSchemaType>('/tournaments/:id/participants', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者作成",
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();
		const participantDTO = await appService.createParticipant({
			tournament_id: request.params.id,
			external_id: request.body.external_id,
		});
		reply.status(200).send(ParticipantDTO2JSON.toJSON(participantDTO));
	})
}
