import { FastifyInstance } from "fastify";
import { TournamentSchema } from "../../schemas/TournamentSchema";
import { NotImplementedError } from "../../errors/error";
import { Type } from "@sinclair/typebox";

const description = `
# 概要
トーナメントを新規で作成します。

# 注意点
* 参加者の追加は別途、**参加者の作成**を行う必要があります。
* マッチの追加はできません。参加者の数に応じて自動的にマッチが作成されます。＜＝この仕様は要相談。例えばオートマッチ機能を作成する？
`

export function CreateTournamentRoute(fastify: FastifyInstance) {
	fastify.post('/tournaments', {
		schema: {
			description,
			tags: ["tournament"],
			summary: "トーナメント作成",
			body: Type.Pick(TournamentSchema(), ['max_num', 'name']),
			response: {
				200: {
					...TournamentSchema(),
					description: "OK",
				}
			}
		}
	}, () => {
		throw NotImplementedError();
	})
}
