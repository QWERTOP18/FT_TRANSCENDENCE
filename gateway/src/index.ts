import fastify, { FastifyReply, FastifyRequest } from "fastify";
import axios, { AxiosError } from "axios";

async function main() {
  const app = fastify();

  app.get("/api/tournament", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // tournamentサービスのAPIを叩く
      const response = await axios.get("http://tournament:8080/api/tournament");
      reply.status(response.status).send(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        reply.status(error.response.status).send(error.response.data);
      } else {
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  });

  app.get("/ping", async (request: FastifyRequest, reply: FastifyReply) => {
    return "pong\n";
  });

  await app.listen({ port: Number(process.env.PORT) || 8000, host: "0.0.0.0" });
  console.log(`Gateway server is running on http://localhost:${process.env.PORT || 8000}`);
}

main(); 
