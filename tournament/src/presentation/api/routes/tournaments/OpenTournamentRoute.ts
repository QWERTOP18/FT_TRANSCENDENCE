import { FastifyInstance } from "fastify";
import { OKSchema } from "../../schemas/OtherSchema";
import { NotImplementedError } from "../../classes/errors/error";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ToStatic } from "../../../types/ToStatic";
import { DIContainer } from "../../../classes/DIContainer";
import { OKJson } from "../../json/OKJson";
import { ExternalIdHeaderSchema } from "../../schemas/headers/ExternalIdHeaderSchema";

const description = `
# 概要
トーナメントを開始します。
stateをreceptionからopenに変更します。
# 注意点
* このトーナメントへの参加者が作成できなくなります。
`

const RouteSchema = {
	Params: Type.Pick(TournamentSchema(), ['id']),
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



export function OpenTournamentRoute(fastify: FastifyInstance) {
	fastify.put<RouteSchemaType>('/tournaments/:id/open', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントを開始する",
			params: RouteSchema.Params,
			headers: RouteSchema.Headers,
			response: {
				200: RouteSchema.Reply[200]
			},
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		await appService.openTournament({
			tournamentId: request.params.id,
			appUser: {
				externalId: request.headers["x-external-id"]
			}
		});
		reply.status(200).send(OKJson);
	})

}
