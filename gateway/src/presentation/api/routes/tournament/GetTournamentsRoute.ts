import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { TournamentSchema, ErrorSchema } from "../../schemas/TournamentSchema";
import { getTournaments } from "../../../../domain/tournament/getTournaments";

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
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tournaments = await getTournaments();
        return tournaments;
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Failed to fetch tournaments" });
      }
    }
  );
}
