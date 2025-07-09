import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { ParticipantIdSchema, ParticipantSchema } from "../../schemas/ParticipantSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
複数の参加者のステータスをin_progressにします。

# 注意点
 * stateがreadyの時のみ可能です。
 * トーナメントがopenの時のみ可能です。
`

export function BattleParticipantRoute(fastify: FastifyInstance) {
	fastify.put('/participants/battle', {
		schema: {
			description,
			tags: ["participant"],
			summary: "参加者のステータスをin_progressにする",
			body: Type.Array(ParticipantIdSchema()),
			response: {
				200: OKSchema()
			}
		}
	}, () => {
		throw new NotImplementedError();
	})
}
