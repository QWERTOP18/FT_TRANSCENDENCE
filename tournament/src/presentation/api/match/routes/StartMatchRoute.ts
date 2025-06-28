import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
:idで指定されたマッチを開始します。
statusがreadyのときにstatusをin_progressに変更します。

# 注意点
* 一度終了したマッチを再度開始することはできません。＜＝仕様変更可能
`

export function StartMatchRoute(fastify: FastifyInstance) {
	fastify.put('/matches/:id/start', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチを開始します",
			response: {
				200: OKSchema()
			},
			params: Type.Pick(MatchSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
