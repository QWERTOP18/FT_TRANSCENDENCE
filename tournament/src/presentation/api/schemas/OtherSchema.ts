import { NumberOptions, ObjectOptions, Static, StringOptions, Type } from "@sinclair/typebox";

export type UUIDSchema = Static<ReturnType<typeof UUIDSchema>>
export function UUIDSchema(options?: StringOptions) {
	return Type.String({ format: "uuid", description: "ID", ...options });
}

export type OrderNumSchema = Static<ReturnType<typeof OrderNumSchema>>
export function OrderNumSchema(options?: NumberOptions) {
	return Type.Number({ minimum: 0, ...options, description: "順番" })
}

export type OKSchema = Static<ReturnType<typeof OKSchema>>
export function OKSchema(options?: ObjectOptions) {
	return Type.Object({
		ok: Type.Literal(true)
	}, { description: "OK", ...options })
}

export type ScoreSchema = Static<ReturnType<typeof ScoreSchema>>
export function ScoreSchema(options?: NumberOptions) {
	return Type.Number({ minimum: 0, ...options, description: "スコア" })
}
