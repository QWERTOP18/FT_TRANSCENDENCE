import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments/{id}/open:
 *   put:
 *     summary: トーナメントを開始
 *     description: 指定されたトーナメントを開始状態に変更します
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
 *         description: トーナメントの開始に成功
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
 *                 state:
 *                   type: string
 *                   description: トーナメントの状態
 *                   example: "open"
 *                 message:
 *                   type: string
 *                   description: 成功メッセージ
 *                   example: "Tournament opened successfully"
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
 *       409:
 *         description: トーナメントは既に開始済みです
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tournament is already open"
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to open tournament"
 */
const OpenTournament = {
  method: "PUT",
  url: "/tournaments/:id/open",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const response = await axios.put(
        `${config.tournamentURL}/tournaments/${id}/open`
      );
      return response.data;
    } catch (error) {
      reply.status(500).send({ error: "Failed to open tournament" });
    }
  },
};

export default OpenTournament;
