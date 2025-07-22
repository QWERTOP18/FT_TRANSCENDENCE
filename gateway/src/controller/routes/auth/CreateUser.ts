import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { UserSchema } from "../../schemas/UserSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { createUser } from "../../../service/auth/createUser";

export default function CreateUser(fastify: FastifyInstance) {
  fastify.post(
    "/auth/signup",
    {
      schema: {
        tags: ["Auth"],
        summary: "ユーザーを作成",
        body: Type.Object({
          name: Type.String({ description: "ユーザー名" }),
        }),
        response: {
          200: UserSchema(),
          404: ErrorSchema(),
          500: ErrorSchema(),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name } = request.body as { name: string };
      try {
        const user = await createUser(name);
        return user;
      } catch (error) {
        reply.status(500).send({ error: "Failed to create user" });
      }
    }
  );
}
