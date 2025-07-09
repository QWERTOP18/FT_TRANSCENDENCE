import { FastifyError, FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotFoundError, NotImplementedError, SomeError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { ToStatic } from "../../../types/ToStatic";
import { TournamentApplicationService } from "../../../../application/service/tournament/TournamentApplicationServiceFacade";
import { PrismaRepositoryFactory } from "../../../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { PrismaClientProvider } from "../../../../infrastructure/Prisma/PrismaClientProvider";
import { TournamentDTO2JSON } from "../TournamentDTO2JSON";
import { IsFastifyErrorSchema } from "../IsFastifyErrorSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { DIContainer } from "../../../classes/DIContainer";

const description = `
# 概要
:idで指定されたトーナメントを取得します。

# 注意点
`

const RouteSchema = {
	Params: Type.Pick(TournamentSchema(), ['id']),
	Querystring: undefined,
	Body: undefined,
	Headers: undefined,
	Reply: {
		200: TournamentSchema({ description: "OK" }),
		404: ErrorSchema({ description: "見つからなかった" })
	}
} as const;

type RouteSchemaType = {
	Params: ToStatic<typeof RouteSchema.Params>,
	Querystring: ToStatic<typeof RouteSchema.Querystring>,
	Body: ToStatic<typeof RouteSchema.Body>,
	Headers: ToStatic<typeof RouteSchema.Headers>,
	Reply: {
		200: ToStatic<typeof RouteSchema.Reply[200]>,
		404: ToStatic<typeof RouteSchema.Reply[404]>
	};
}

export function GetTournamentRoute(fastify: FastifyInstance) {
	fastify.get<RouteSchemaType>('/tournaments/:id', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント取得",
			response: {
				200: RouteSchema.Reply[200],
				404: RouteSchema.Reply[404],
			},
			params: RouteSchema.Params
		}
	}, async (request, reply) => {
		const appService = DIContainer.applicationService();

		const tournament = await appService.getTournament({
			tournamentId: request.params.id
		});
		if (tournament == null)
			throw new NotFoundError();
		reply.status(200).send(TournamentDTO2JSON.toJSON(tournament))
	})
}
