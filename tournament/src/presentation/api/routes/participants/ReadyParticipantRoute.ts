import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../classes/errors/error";
import { ParticipantSchema } from "../../schemas/ParticipantSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
参加者のステータスをreadyにします。

# 注意点
 * sateがpendingの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`

export function ReadyParticipantRoute(fastify: FastifyInstance) {
	fastify.put('/participants/:id/ready', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者のステータスをreadyにする",
			params: Type.Pick(ParticipantSchema(), ['id']),
			response: {
				200: OKSchema()
			}
		}
	}, () => {
		throw new NotImplementedError();
	})
}
