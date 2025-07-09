import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotFoundError, NotImplementedError } from "../../errors/error";
import { HistorySchema } from "../../schemas/HistorySchema";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ToStatic } from "../../../types/ToStatic";
import { TournamentApplicationService } from "../../../../application/TournamentApplicationServiceFacade";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { HistoryDTO2JSON } from "../HistoryDTO2JSON";
import { DIContainer } from "../../../classes/DIContainer";

const description = `
# 概要
トーナメントの対戦結果を取得します。

# 注意点
`

const RouteSchema = {
	Params: Type.Pick(TournamentSchema(), ['id']),
	Querystring: undefined,
	Body: undefined,
	Headers: undefined,
	Reply: {
		200: Type.Array(HistorySchema(), { description: "トーナメントの対戦結果" }),
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



export function GetTournamentHistoryRoute(fastify: FastifyInstance) {
	fastify.get<RouteSchemaType>('/tournaments/:id/histories', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントの対戦結果を取得する",
			response: {
				200: RouteSchema.Reply[200]
			},
			params: RouteSchema.Params,
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();
		const histories = await appService.getHistories({ tournamentId: request.params.id });
		if (histories == null)
			throw new NotFoundError();
		reply.status(200).send(histories.map(h => HistoryDTO2JSON.toJSON(h)));
	})
}
