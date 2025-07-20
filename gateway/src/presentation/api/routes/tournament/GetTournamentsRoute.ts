import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments:
 *   get:
 *     summary: トーナメント一覧を取得
 *     description: システム内のすべてのトーナメントの一覧を取得します
 *     tags:
 *       - Tournament
 *     responses:
 *       200:
 *         description: トーナメント一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: トーナメントID
 *                   name:
 *                     type: string
 *                     description: トーナメント名
 *                   description:
 *                     type: string
 *                     description: トーナメントの説明
 *                   max_num:
 *                     type: number
 *                     description: 最大参加者数
 *                   state:
 *                     type: string
 *                     description: トーナメントの状態
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch tournaments"
 */
const GetTournaments = {
  method: "GET",
  url: "/tournaments",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const endpoint = `${config.tournamentURL}/tournaments`;
    try {
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Failed to fetch tournaments" });
    }
  },
};

export default GetTournaments;
