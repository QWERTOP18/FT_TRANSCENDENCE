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

  await app.listen({ port: Number(process.env.PORT) || 4000, host: "0.0.0.0" });
  console.log(`Game server is running on http://localhost:${process.env.PORT || 4000}`);
  // WebSocketサーバ・ルーム管理をGameGatewayに委譲
  new GameGateway(app.server);
}

main();
