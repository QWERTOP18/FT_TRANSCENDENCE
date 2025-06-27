import { NumberOptions, ObjectOptions, SchemaOptions, Static, StringOptions, Type } from "@sinclair/typebox";
import { UUIDSchema } from "./OtherSchema";
import { ParticipantSchema } from "./ParticipantSchema";
import { MatchSchema } from "./MatchSchema";

// トーナメント
export function TournamentSchema (options?: ObjectOptions) {
	return Type.Object({
		id: TournamentIdSchema({description: "トーナメントID"}),
		name: Type.String({description: "トーナメント名"}),
		status: TournamentStatusSchema(),
		num: ParticicantNumSchema({ description: "現在の参加人数" }),
		max_num: ParticicantNumSchema({ description: "最大の参加人数" }),
		particicants: Type.Array(ParticipantSchema(), { description: "参加者リスト" }),
		matches: Type.Array(MatchSchema(), { description: "マッチリスト" }),
	}, { description: "トーナメント", ...options })
}
export type TournamentSchema = Static<ReturnType<typeof TournamentSchema>>

// トーナメントステータス
export function TournamentStatusSchema(options?: SchemaOptions) {
	return Type.Union([
		Type.Literal('reception'),
		Type.Literal('open'),
		Type.Literal('close'),
	], {
		description: "トーナメントの状況 - reception: 受付中, open: 開催中, close: 終了",
		...options
	})
}
export type TournamentStatusSchema = Static<ReturnType<typeof TournamentStatusSchema>>

// 参加人数
export function ParticicantNumSchema(options?: NumberOptions) {
	return Type.Number({ minimum: 0, maximum: 16, ...options })
}
export type ParticicantNumSchema = Static<ReturnType<typeof ParticicantNumSchema>>

// トーナメントID
export function TournamentIdSchema(options?: StringOptions) {
	return UUIDSchema({ description: "ID", ...options })
}
export type TournamentIdSchema = Static<ReturnType<typeof TournamentIdSchema>>
