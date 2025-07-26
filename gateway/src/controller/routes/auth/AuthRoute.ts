import { FastifyInstance } from "fastify";
import CreateUser from "./CreateUser";
import AuthenticateUser from "./AuthenticateUser";

export function AuthRoutes(fastify: FastifyInstance) {
  const routes = [CreateUser, AuthenticateUser] as const;

  routes.forEach((route) => fastify.register(route));
}
