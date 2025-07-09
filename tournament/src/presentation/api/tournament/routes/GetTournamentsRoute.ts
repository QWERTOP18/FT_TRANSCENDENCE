import { Static, TSchema, Type } from "@sinclair/typebox";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { TournamentApplicationService } from "../../../../application/TournamentApplicationServiceFacade";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ToStatic } from "../../../../types/ToStatic";

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
		const appService = new TournamentApplicationService({
			repositoryFactory: new PrismaRepositoryFactory(new PrismaClientProvider())
		});

		const tournamentsDTO = await appService.getAllTournament({});
		reply.status(200).send(
			tournamentsDTO.map((tournamentDTO) => ({
				id: tournamentDTO.id,
				name: tournamentDTO.name,
				champion_id: tournamentDTO.championId ?? '',
				owner_id: tournamentDTO.ownerId,
				description: tournamentDTO.description,
				state: tournamentDTO.state,
				participants: tournamentDTO.participants.map(p => p.id),
				histories: tournamentDTO.histories.map(h => h.id),
			}))
		)
	})
}
