import { ObjectOptions, Static, Type } from "@sinclair/typebox"


export type ErrorSchema = Static<ReturnType<typeof ErrorSchema>>
export const ErrorSchema = (options?: ObjectOptions) => {
	return Type.Object({
		code: Type.String({ description: 'エラーコード' }),
		statusCode: Type.Number({ description: 'ステータスコード' }),
		error: Type.String({ description: 'エラー概要' }),
		message: Type.String({ description: 'エラーメッセージ' }),
	}, { description: "エラー", ...options })
}
