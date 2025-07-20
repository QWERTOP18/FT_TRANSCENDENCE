import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments/{id}:
 *   get:
 *     summary: 特定のトーナメントを取得
 *     description: 指定されたIDのトーナメントの詳細情報を取得します
 *     tags:
 *       - Tournament
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: トーナメントID
 *     responses:
 *       200:
 *         description: トーナメント情報の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: トーナメントID
 *                 name:
 *                   type: string
 *                   description: トーナメント名
 *                 description:
 *                   type: string
 *                   description: トーナメントの説明
 *                 max_num:
 *                   type: number
 *                   description: 最大参加者数
 *                 state:
 *                   type: string
 *                   description: トーナメントの状態
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: 作成日時
 *       404:
 *         description: トーナメントが見つかりません
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tournament not found"
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch tournament"
 */
const GetTournament = {
  method: "GET",
  url: "/tournaments/:id",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const response = await axios.get(
        `${config.tournamentURL}/tournaments/${id}`
      );
      return response.data;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch tournament" });
    }
  },
};

export default GetTournament;
