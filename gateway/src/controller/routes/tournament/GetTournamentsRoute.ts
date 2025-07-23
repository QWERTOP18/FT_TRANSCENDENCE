import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { tournamentService } from "../../../service/tournament/TournamentService";

const description = `
# 概要
トーナメント一覧を取得します。
`;

export default function GetTournaments(fastify: FastifyInstance) {
  fastify.get(
    "/tournaments",
    {
      schema: {
        description,
        tags: ["Tournament"],
        summary: "トーナメント一覧を取得",
        response: {
          200: Type.Array(TournamentSchema()),
          400: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tournaments = await tournamentService.getTournaments();
        return tournaments;
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Failed to fetch tournaments" });
      }
    }
  );
}
