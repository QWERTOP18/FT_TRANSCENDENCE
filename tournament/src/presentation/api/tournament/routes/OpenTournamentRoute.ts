import { FastifyInstance } from "fastify";
import { OKSchema } from "../../schemas/OtherSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { TournamentSchema } from "../../schemas/TournamentSchema";

const description = `
# 概要
トーナメントを開始します。

# 注意点
* 参加者の変更ができなくなります。したがってマッチの追加もされません。
`

export function OpenTournamentRoute(fastify: FastifyInstance) {
	fastify.post('/tournaments/:id/open', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメントを開始する",
			response: {
				200: OKSchema()
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})

}
