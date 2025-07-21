import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { TournamentRoutes } from "./tournament/TournamentRoutes";

export async function Routes(app: FastifyInstance) {
  await app.register(cors, {
    origin: "*",
    credentials: true,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "FT_TRANSCENDENCE Gateway API",
        version: "1.0.0",
        description: "トーナメント管理API",
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

  // Register tournament routes first
  await app.register(TournamentRoutes);

  app.get("/", (request, reply) => {
    reply.redirect("/docs");
  });

  app.get("/ping", async (request, reply) => {
    return "pong\n";
  });
}
