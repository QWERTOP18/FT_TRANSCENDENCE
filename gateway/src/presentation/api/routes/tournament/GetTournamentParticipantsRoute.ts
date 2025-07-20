import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments/{id}/participants:
 *   get:
 *     summary: トーナメント参加者一覧を取得
 *     description: 指定されたトーナメントに参加しているプレイヤーの一覧を取得します
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
 *         description: 参加者一覧の取得に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 参加者ID
 *                   user_id:
 *                     type: string
 *                     description: ユーザーID
 *                   tournament_id:
 *                     type: string
 *                     description: トーナメントID
 *                   state:
 *                     type: string
 *                     description: 参加者の状態
 *                     enum: [waiting, ready, playing, eliminated, winner]
 *                   score:
 *                     type: number
 *                     description: スコア
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: 参加日時
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
 *                   example: "Failed to fetch tournament participants"
 */
const GetTournamentParticipants = {
  method: "GET",
  url: "/tournaments/:id/participants",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const response = await axios.get(
        `${config.tournamentURL}/tournaments/${id}/participants`
      );
      return response.data;
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Failed to fetch tournament participants" });
    }
  },
};

export default GetTournamentParticipants;
