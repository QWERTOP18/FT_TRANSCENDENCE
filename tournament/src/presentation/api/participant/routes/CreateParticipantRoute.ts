import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";

const description = `
# 概要
参加者を作成します。

# 注意点
 * トーナメントがreceptionの時のみ、参加者を作成できます。
`

export function CreateParticipantRoute(fastify: FastifyInstance) {
	fastify.post('/participants', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者作成",
			body: Type.Pick(ParticipantSchema(), ['tournament_id', 'external_id']),
			response: {
				200: ParticipantSchema({ description: "OK" })
			}
		}
	}, () => {
		throw new NotImplementedError();
	})
}
