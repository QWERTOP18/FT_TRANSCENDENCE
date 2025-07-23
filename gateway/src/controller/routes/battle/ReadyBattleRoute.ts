import { FastifyInstance } from "fastify";
import { CommonHeaderSchema } from "../../schemas/HeaderSchema";
import { battleService } from "../../../service/battle/BattleService";

const description = `
# 概要
ユーザーをready状態にします。
`;

export default function ReadyBattle(fastify: FastifyInstance) {
  fastify.post(
    "/:tournament_id/battle/ready",
    {
      schema: {
        description,
        tags: ["Battle"],
        summary: "ユーザーをready状態にする",
        headers: CommonHeaderSchema(),
        params: {
          type: "object",
          properties: {
            tournament_id: { type: "string" },
          },
          required: ["tournament_id"],
        },
      },
    },
    async (request, reply) => {
      const { tournament_id } = request.params as { tournament_id: string };
      return battleService.readyBattle(
        tournament_id,
        request.headers["X-User-Id"] as string
      );
    }
  );
}
