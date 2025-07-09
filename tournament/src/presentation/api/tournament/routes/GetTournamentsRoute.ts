import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { TournamentApplicationService } from "../../../../application/TournamentApplicationServiceFacade";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
トーナメント一覧を取得します。

# 注意点
`

const replySchema = Type.Array(TournamentSchema(), { description: "OK" });

type GetTournamentsSchema = {
	Reply: Static<typeof replySchema>;
}

export function GetTournamentsRoute(fastify: FastifyInstance) {
	fastify.get<GetTournamentsSchema>('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント一覧取得",
			response: {
				200: replySchema
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
