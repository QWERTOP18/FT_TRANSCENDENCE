import { FastifyInstance } from "fastify";
import ReadyBattle from "./ReadyBattleRoute";
import CancelBattle from "./CancelBattle";

export function BattleRoutes(fastify: FastifyInstance) {
  const routes = [ReadyBattle, CancelBattle] as const;

  routes.forEach((route) => fastify.register(route));
}
