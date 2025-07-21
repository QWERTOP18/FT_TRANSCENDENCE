import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  TournamentSchema,
  CreateTournamentSchema,
  ErrorSchema,
} from "../../schemas/TournamentSchema";
import { createTournament } from "../../../../domain/tournament/createTournament";

export default function CreateTournament(fastify: FastifyInstance) {
  fastify.post(
    "/tournaments",
    {
      schema: {
        tags: ["Tournament"],
        summary: "トーナメントを作成",
        body: CreateTournamentSchema(),
        response: {
          201: TournamentSchema(),
          400: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, description, max_num } = request.body as {
        name: string;
        description: string;
        max_num: number;
      };
      try {
        const tournament = await createTournament({
          name,
          description,
          max_num,
        });
        return tournament;
      } catch (error) {
        reply.status(500).send({ error: "Failed to create tournament" });
      }
    }
  );
}
