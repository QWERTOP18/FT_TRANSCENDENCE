import { Static, TSchema, Type } from "@sinclair/typebox";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { TournamentApplicationService } from "../../../../application/service/tournament/TournamentApplicationServiceFacade";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ToStatic } from "../../../types/ToStatic";
import { DIContainer } from "../../../classes/DIContainer";
import { TournamentDTO2JSON } from "../../classes/TournamentDTO2JSON";

const description = `
# 概要
トーナメント一覧を取得します。

# 注意点
`

const RouteSchema = {
	Params: undefined,
	Querystring: undefined,
	Body: undefined,
	Headers: undefined,
	Reply: {
		200: Type.Array(TournamentSchema(), { description: "OK" }),
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

export function GetTournamentsRoute(fastify: FastifyInstance) {
	fastify.get<RouteSchemaType>('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント一覧取得",
			response: {
				200: RouteSchema.Reply[200]
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		const tournamentsDTO = await appService.getAllTournament({});
		reply.status(200).send(
			tournamentsDTO.map((tournamentDTO) => TournamentDTO2JSON.toJSON(tournamentDTO))
		)
	})
}
