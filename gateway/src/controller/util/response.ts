import { FastifyReply } from "fastify";

export class ServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

// エラーハンドリングヘルパー関数
export function handleServiceError(
  error: unknown,
  reply: FastifyReply,
  defaultMessage: string
) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as any;
    const statusCode = axiosError.response?.status || 500;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      defaultMessage;
    reply.status(statusCode).send({ error: errorMessage });
  } else {
    reply.status(500).send({ error: defaultMessage });
  }
}
