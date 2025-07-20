import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments/{id}/history:
 *   get:
 *     summary: トーナメント履歴を取得
 *     description: 指定されたトーナメントの試合履歴を取得します
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
 *         description: 履歴の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 履歴ID
 *                   tournament_id:
 *                     type: string
 *                     description: トーナメントID
 *                   winner_id:
 *                     type: string
 *                     description: 勝者のユーザーID
 *                   loser_id:
 *                     type: string
 *                     description: 敗者のユーザーID
 *                   winner_score:
 *                     type: number
 *                     description: 勝者のスコア
 *                   loser_score:
 *                     type: number
 *                     description: 敗者のスコア
 *                   round:
 *                     type: number
 *                     description: ラウンド番号
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: 試合日時
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
 *                   example: "Failed to fetch tournament history"
 */
const GetTournamentHistory = {
  method: "GET",
  url: "/tournaments/:id/history",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const response = await axios.get(
        `${config.tournamentURL}/tournaments/${id}/history`
      );
      return response.data;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch tournament history" });
    }
  },
};

export default GetTournamentHistory;
