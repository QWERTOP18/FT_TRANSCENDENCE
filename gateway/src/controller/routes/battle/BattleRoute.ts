import { FastifyInstance } from "fastify";
import ReadyBattle from "./ReadyBattleRoute";
import CancelBattle from "./CancelBattle";
import AIopponent from "./AIopponentRoute";

export function BattleRoutes(fastify: FastifyInstance) {
  const routes = [ReadyBattle, CancelBattle, AIopponent] as const;

  routes.forEach((route) => fastify.register(route));
}
