import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
トーナメントを削除します。

# 注意点
* このAPIは、誤ってトーナメントを削除するのを防ぐため、使用できなくなる可能性があります。
* トーナメントのすべての内容が消えます。
`

export function DeleteTournamentRoute(fastify: FastifyInstance) {
	fastify.delete('/tournaments/:id', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント削除",
			response: {
				200: OKSchema()
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
