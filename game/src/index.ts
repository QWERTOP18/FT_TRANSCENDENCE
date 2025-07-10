import fastify from "fastify";
import { GameRoutes } from "./presentation/api/route";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { GameGateway } from "./presentation/gateway/GameGateway";

async function main() {
  const app = fastify();

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Game API",
        version: "1.0.0",
      },
    },
  });
  await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  app.register(GameRoutes);

  app.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  await app.listen({ port: 4000 });
  const server = app.server;

  // WebSocketサーバ・ルーム管理をGameGatewayに委譲
  new GameGateway(server);
}

main();
