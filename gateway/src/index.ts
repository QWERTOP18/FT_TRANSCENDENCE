import fastify from "fastify";
import { Routes as routes } from "./controller/routes/route";
import { config } from "./config/config";

async function main() {
  const app = fastify();

  await app.register(routes);

  await app.listen({ port: config.port, host: config.host });
  console.log(
    `Gateway server is running on http://${config.host}:${config.port}`
  );
}

main();
