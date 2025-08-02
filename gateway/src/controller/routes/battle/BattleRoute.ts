import { FastifyInstance } from "fastify";
import ReadyBattle from "./ReadyBattleRoute";
import CancelBattle from "./CancelBattle";
import AIopponent from "./AIopponentRoute";
import EndBattle from "./EndBattleRoute";

export function BattleRoutes(fastify: FastifyInstance) {
  const routes = [ReadyBattle, CancelBattle, AIopponent, EndBattle] as const;

  routes.forEach((route) => fastify.register(route));
}
