import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotImplementedError } from "../../errors/error";
import { MatchSchema } from "../../schemas/MatchSchema";
import { OKSchema } from "../../schemas/OtherSchema";

const description = `
# 概要
マッチを作成します。

# 注意点
`

export function CreateMatchRoute(fastify: FastifyInstance) {
	fastify.post('/matches', {
		schema: {
			description,
			tags: ["match"],
			summary: "マッチ作成",
			response: {
				200: MatchSchema(),
			}
		}
	}, () => {
		throw NotImplementedError();
	})
}
