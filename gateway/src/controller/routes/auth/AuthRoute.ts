import { FastifyInstance } from "fastify";
import CreateUser from "./CreateUser";

export function AuthRoutes(fastify: FastifyInstance) {
  const routes = [CreateUser] as const;

  routes.forEach((route) => fastify.register(route));
}
