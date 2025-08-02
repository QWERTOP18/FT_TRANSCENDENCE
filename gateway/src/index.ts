import fastify from "fastify";
import cors from "@fastify/cors";
import { Routes as routes } from "./controller/routes/route";
import { config } from "./config/config";

async function main() {
  const app = fastify();

  // CORS設定を最初に適用
  await app.register(cors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "x-user-id", "Authorization", "Accept"],
    exposedHeaders: ["Content-Type", "x-user-id"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.addHook("onRequest", (request, reply, done) => {
    console.log(`Request: ${request.method} ${request.url}`);
    done();
  });
  await app.register(routes);

  await app.listen({ port: config.port, host: config.host });
  console.log(
    `Gateway server is running on http://${config.host}:${config.port}`
  );
}

main();
