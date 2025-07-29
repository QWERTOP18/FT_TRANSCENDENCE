import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { UserSchema } from "../../schemas/UserSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { createUser } from "../../../service/auth/AuthService";
import { handleServiceError } from "../../util/response";
import { DuplicateError } from "../../../service/auth/AuthService";

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
        if (error instanceof DuplicateError) {
          reply.status(400).send({
            code: error.code,
            statusCode: 400,
            error: "Bad Request",
            message: error.message,
          });
        } else {
          handleServiceError(error, reply, "Failed to create user");
        }
      }
    }
  );
}
