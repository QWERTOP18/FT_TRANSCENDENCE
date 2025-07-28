import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { UserIdHeaderSchema } from "../../schemas/headers/UserIdHeaderSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { handleServiceError } from "../../util/response";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
トーナメントを開始します。
stateをreceptionからopenに変更します。
# 注意点
* このトーナメントへの参加者が作成できなくなります。
`;

const RouteSchema = {
  Params: Type.Pick(TournamentSchema(), ["id"]),
  Querystring: undefined,
  Body: undefined,
  Headers: UserIdHeaderSchema,
  Reply: {
    200: OKSchema(),
  },
} as const;

export default function OpenTournament(fastify: FastifyInstance) {
  fastify.put(
    "/tournaments/:id/open",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "トーナメントを開始",
        params: RouteSchema.Params,
        headers: RouteSchema.Headers,
        response: {
          200: RouteSchema.Reply[200],
          404: ErrorSchema({ description: "見つからなかった" }),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await tournamentService.openTournament(request);
        return reply.status(200).send({ ok: true });
      } catch (error) {
        handleServiceError(error, reply, "Failed to open tournament");
      }
    }
  );
}
