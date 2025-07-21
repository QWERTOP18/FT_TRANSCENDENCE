import { FastifyInstance } from "fastify";

export function BattleRoutes(fastify: FastifyInstance) {
  const routes = [] as const;

  routes.forEach((route) => fastify.register(route));
}
