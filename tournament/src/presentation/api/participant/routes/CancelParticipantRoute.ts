import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
参加者のステータスをpendingにします。

# 注意点
 * stateがreadyの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`

export function CancelParticipantRoute(fastify: FastifyInstance) {
	fastify.put('/participants/:id/cancel', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者のステータスをpendingにする",
			params: Type.Pick(ParticipantSchema(), ['id']),
			response: {
				200: OKSchema()
			}
		}
	}, () => {
		throw new NotImplementedError();
	})
}
