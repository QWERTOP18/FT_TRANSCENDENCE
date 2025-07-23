import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { tournamentService } from "../../../service/tournament/TournamentService";
import { TournamentSchema } from "../../schemas/TournamentSchema";
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
  Reply: {
    200: TournamentSchema(),
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
        response: {
          200: OKSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const tournament = await tournamentService.openTournament(id);
        return tournament;
      } catch (error) {
        reply.status(500).send({ error: "Failed to open tournament" });
      }
    }
  );
}
