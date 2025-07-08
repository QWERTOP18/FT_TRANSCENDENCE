import { FastifyInstance } from "fastify";
import { CreateRoomRoute } from "./room/CreateRoomRoute";

export function GameRoutes(fastify: FastifyInstance) {
  const routes = [CreateRoomRoute] as const;

  routes.forEach((route) => fastify.register(route));
}
