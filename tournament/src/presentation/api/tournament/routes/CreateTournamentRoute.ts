import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { Static, Type } from "@sinclair/typebox";
import { TournamentApplicationService } from "../../../../application/TournamentApplicationServiceFacade";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { ToStatic } from "../../../types/ToStatic";
import { DIContainer } from "../../../classes/DIContainer";
import { TournamentDTO } from "../../../../application/dto/TournamentDTO";
import { TournamentDTO2JSON } from "../TournamentDTO2JSON";

const description = `
# 概要
トーナメントを新規で作成します。

# 注意点
* 参加者の追加は別途、**参加者の作成**を行う必要があります。
* マッチの追加はできません。参加者の数に応じて自動的にマッチが作成されます。＜＝この仕様は要相談。例えばオートマッチ機能を作成する？
`


const RouteSchema = {
	Params: undefined,
	Querystring: undefined,
	Body: Type.Intersect([
		Type.Pick(TournamentSchema(), ['name', 'description']),
		Type.Object({
			ownerExternalId: Type.String({ description: "トーナメントのオーナーの外部ID" }),
		})
	]),
	Headers: undefined,
	Reply: {
		200: TournamentSchema({ description: "OK" }),
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

export function CreateTournamentRoute(fastify: FastifyInstance) {
	fastify.post<RouteSchemaType>('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント作成",
			body: RouteSchema.Body,
			response: {
				200: RouteSchema.Reply[200],
			}
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		const tournamentDTO = await appService.createTournament(request.body);
		reply.status(200).send(TournamentDTO2JSON.toJSON(tournamentDTO));
	})
}
