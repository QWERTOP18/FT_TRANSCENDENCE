import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { TournamentRoutes } from "./tournament/TournamentRoutes";

export function Routes(app: FastifyInstance) {
  app.register(cors, {
    origin: "*",
    credentials: true,
  });

  app.register(swagger, {
    openapi: {
      info: {
        title: "FT_TRANSCENDENCE Gateway API",
        version: "1.0.0",
        description:
          "FT_TRANSCENDENCEプロジェクトのゲートウェイAPIです。トーナメント管理、ユーザー認証、ゲーム機能を提供します。",
        contact: {
          name: "API Support",
          email: "support@ft-transcendence.com",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      servers: [
        {
          url: "http://localhost:8000",
          description: "Development server",
        },
      ],
      tags: [
        {
          name: "Tournament",
          description: "トーナメント管理API",
        },
      ],
    },
  });
  app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });
  app.get("/", (request, reply) => {
    reply.redirect("/docs");
  });

  app.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  // Register tournament routes
  TournamentRoutes(app);
}
