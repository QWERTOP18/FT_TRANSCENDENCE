import { FastifyInstance } from "fastify";
import { CreateRoomRoute } from "./room/CreateRoomRoute";
import { ReadyRoute } from "./ready/ReadyRoute";

export function GameRoutes(fastify: FastifyInstance) {
  const routes = [CreateRoomRoute, ReadyRoute] as const;

  routes.forEach((route) => fastify.register(route));
}
