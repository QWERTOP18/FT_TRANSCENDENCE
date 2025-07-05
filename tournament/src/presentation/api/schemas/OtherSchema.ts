import { NumberOptions, ObjectOptions, Static, StringOptions, Type } from "@sinclair/typebox";

export function UUIDSchema(options?: StringOptions) {
	return Type.String({ format: "uuid", description: "ID", ...options });
}
export type UUIDSchema = Static<ReturnType<typeof UUIDSchema>>

export function OrderNumSchema(options?: NumberOptions) {
	return Type.Number({ minimum: 0, ...options, description: "順番" })
}
export type OrderNumSchema = Static<ReturnType<typeof OrderNumSchema>>

export function OKSchema(options?: ObjectOptions) {
	return Type.Object({
		ok: Type.Literal(true)
	}, { description: "OK", ...options })
}
export type OKSchema = Static<ReturnType<typeof OKSchema>>

export function ScoreSchema(options?: NumberOptions) {
	return Type.Number({ minimum: 0, ...options, description: "スコア" })
}
