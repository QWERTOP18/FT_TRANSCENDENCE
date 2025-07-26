import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from "@sinclair/typebox";
import { UserSchema } from "../../schemas/UserSchema";
import { ErrorSchema } from "../../schemas/ErrorSchema";
import { authenticateUser } from "../../../service/auth/AuthService";
import { handleServiceError } from "../../util/response";
import { NotFoundError } from "../../../service/auth/AuthService";

export default function AuthenticateUser(fastify: FastifyInstance) {
  fastify.post(
    "/auth/authenticate",
    {
      schema: {
        tags: ["Auth"],
        summary: "ユーザーを認証",
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
        const user = await authenticateUser(name);
        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          reply.status(404).send({
            code: error.code,
            statusCode: 404,
            error: error.name,
            message: error.message,
          });
        } else {
          handleServiceError(error, reply, "Failed to authenticate user");
        }
      }
    }
  );
}
