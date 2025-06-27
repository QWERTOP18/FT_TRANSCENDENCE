import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
トーナメントを更新します。

# 注意点
* トーナメントの名称やmax_numを変更すると混乱が生じるためおすすめしません。
* すでに参加済みの参加者の人数以下にmax_numを設定することはできません。
`

export function UpdateTournamentRoute(fastify: FastifyInstance) {

	fastify.put('/tournaments/:id', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント更新",
			body: Type.Pick(TournamentSchema(), ['name', 'max_num']),
			response: {
				200: OKSchema()
			},
			params: Type.Pick(TournamentSchema(), ['id'])
		}
	}, () => {
		throw NotImplementedError();
	})
}
