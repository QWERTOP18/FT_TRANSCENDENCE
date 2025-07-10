import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotFoundError, NotImplementedError } from "../../classes/errors/error";
import { DIContainer } from "../../../classes/DIContainer";
import { ToStatic } from "../../../types/ToStatic";
import { ParticipantDTO2JSON } from "../../classes/ParticipantDTO2JSON";

const description = `
# 概要
トーナメントの参加者を取得します。

# 注意点
`

const RouteSchema = {
	Params: Type.Pick(TournamentSchema(), ['id']),
	Querystring: undefined,
	Body: undefined,
	Headers: undefined,
	Reply: {
		200: Type.Array(ParticipantSchema(), { description: "トーナメント参加者" }),
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

export function GetTournamentParticipantsRoute(fastify: FastifyInstance) {
	fastify.get<RouteSchemaType>('/tournaments/:id/participants', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントの参加者を取得する",
			response: {
				200: RouteSchema.Reply[200],
			},
			params: RouteSchema.Params
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		const participants = await appService.getParticipants({ tournamentId: request.params.id });
		if (participants == null)
			throw new NotFoundError();
		reply.status(200).send(
			participants.map(participant => ParticipantDTO2JSON.toJSON(participant)));
	})
}
