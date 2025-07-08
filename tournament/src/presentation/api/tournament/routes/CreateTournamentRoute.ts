import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { Static, Type } from "@sinclair/typebox";
import { TournamentApplicationService } from "../../../../application/TournamentApplicationServiceFacade";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";

const description = `
# 概要
トーナメントを新規で作成します。

# 注意点
* 参加者の追加は別途、**参加者の作成**を行う必要があります。
* マッチの追加はできません。参加者の数に応じて自動的にマッチが作成されます。＜＝この仕様は要相談。例えばオートマッチ機能を作成する？
`

const bodySchema = Type.Intersect([
	Type.Pick(TournamentSchema(), ['name', 'description']),
	Type.Object({
		ownerExternalId: Type.String({ description: "トーナメントのオーナーの外部ID" }),
	})
]);

const replySchema = TournamentSchema({ description: "OK" });

type CreateTournamentHandlerSchema = {
	Body: Static<typeof bodySchema>;
	Reply: Static<typeof replySchema>;
}

export function CreateTournamentRoute(fastify: FastifyInstance) {
	fastify.post<CreateTournamentHandlerSchema>('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント作成",
			body: bodySchema,
			response: {
				200: replySchema,
			}
		}
	}, async (request, reply) => {
		console.log('Creating tournament with body:\n', request.body);
		const service = new TournamentApplicationService({
			repositoryFactory: new PrismaRepositoryFactory(new PrismaClientProvider())
		});
		try {
			const tournamentDTO = await service.createTournament(request.body);
			reply.status(200).send({
				id: tournamentDTO.id,
				name: tournamentDTO.name,
				champion_id: tournamentDTO.championId ?? '',
				owner_id: tournamentDTO.ownerId,
				description: tournamentDTO.description,
				state: tournamentDTO.state,
				participants: tournamentDTO.participants.map(p => p.id),
				histories: tournamentDTO.histories.map(h => h.id),
			})
		} catch (error) {
			console.error('Error creating tournament:', error);
		}
	})
}
