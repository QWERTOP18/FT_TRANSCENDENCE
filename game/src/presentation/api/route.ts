import { FastifyInstance } from "fastify";
import { CreateRoomRoute } from "./room/CreateRoomRoute";
import { ReadyRoute } from "./ready/ReadyRoute";
import { GameGateway } from "../gateway/GameGateway";
import { PlayAiRoute } from "./ai/PlayAiRoute";

export function GameRoutes(fastify: FastifyInstance, gameGateway: GameGateway) {
  CreateRoomRoute(fastify, gameGateway);
  ReadyRoute(fastify, gameGateway);
  PlayAiRoute(fastify, gameGateway);
}
