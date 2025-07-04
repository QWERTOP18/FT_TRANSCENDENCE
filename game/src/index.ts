import fastify from "fastify";
import { GameRoutes } from "./presentation/api/route";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

async function main() {
  const server = fastify();

  await server.register(swagger, {
    openapi: {
      info: {
        title: "Game API",
        version: "1.0.0",
      },
    },
  });
  await server.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  server.register(GameRoutes);

  server.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  server.listen({ port: 4000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
