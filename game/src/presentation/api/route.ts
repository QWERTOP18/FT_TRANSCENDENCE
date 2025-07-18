import { FastifyInstance } from "fastify";
import { CreateRoomRoute } from "./room/CreateRoomRoute";
import { ReadyRoute } from "./ready/ReadyRoute";
import { GameGateway } from "../gateway/GameGateway";

export function GameRoutes(fastify: FastifyInstance, gameGateway: GameGateway) {
  CreateRoomRoute(fastify, gameGateway);
  ReadyRoute(fastify, gameGateway);
}
