import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { config } from "../../../../config/config";

/**
 * @swagger
 * /tournaments:
 *   post:
 *     summary: 新しいトーナメントを作成
 *     description: 新しいトーナメントを作成します
 *     tags:
 *       - Tournament
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - max_num
 *             properties:
 *               name:
 *                 type: string
 *                 description: トーナメント名
 *                 example: "Spring Tournament 2024"
 *               description:
 *                 type: string
 *                 description: トーナメントの説明
 *                 example: "Spring season tournament for all players"
 *               max_num:
 *                 type: number
 *                 description: 最大参加者数
 *                 minimum: 2
 *                 maximum: 32
 *                 example: 16
 *     responses:
 *       201:
 *         description: トーナメントの作成に成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 作成されたトーナメントID
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
 *                   example: "created"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: 作成日時
 *       400:
 *         description: リクエストが無効です
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data"
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create tournament"
 */
const CreateTournament = {
  method: "POST",
  url: "/tournaments",
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, description, max_num } = request.body as {
      name: string;
      description: string;
      max_num: number;
    };
    try {
      const response = await axios.post(`${config.tournamentURL}/tournaments`, {
        name,
        description,
        max_num,
      });
      return response.data;
    } catch (error) {
      reply.status(500).send({ error: "Failed to create tournament" });
    }
  },
};

export default CreateTournament;
