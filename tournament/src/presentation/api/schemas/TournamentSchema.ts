import { ObjectOptions, SchemaOptions, Static, StringOptions, Type } from "@sinclair/typebox";
import { HistoryIdSchema, HistorySchema } from "./HistorySchema";
import { UUIDSchema } from "./OtherSchema";
import { ParticipantIdSchema } from "./ParticipantSchema";

// トーナメント
export type TournamentSchema = Static<ReturnType<typeof TournamentSchema>>
export function TournamentSchema(options?: ObjectOptions) {
	return Type.Object({
		id: TournamentIdSchema({ description: "トーナメントID" }),
		champion_id: ParticipantIdSchema({ description: "優勝者の参加者ID", nullable: true }),
		owner_id: ParticipantIdSchema({ description: "トーナメントのオーナー参加者ID" }),
		name: Type.String({ description: "トーナメント名" }),
		max_num: Type.Number({ description: "トーナメントの最大参加人数", minimum: 2 }),
		description: Type.Optional(Type.String({ description: "トーナメントの説明" })),
		rule: TournamentRuleSchema({ description: "トーナメントのルール" }),
		state: TournamentStatusSchema(),
		participants: Type.Array(ParticipantIdSchema(), { description: "参加者リスト" }),
		histories: Type.Array(HistoryIdSchema(), { description: "トーナメントの履歴" }),
	}, { description: "トーナメント", ...options })
}

// トーナメントステータス
export type TournamentStatusSchema = Static<ReturnType<typeof TournamentStatusSchema>>
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

// トーナメントルール
export type TournamentRuleSchema = Static<ReturnType<typeof TournamentRuleSchema>>
export function TournamentRuleSchema(options?: SchemaOptions) {
	return Type.Union([
		Type.Literal('simple'),
	], {
		description: "トーナメントのルール - simple: シンプルなルール",
		...options
	})
}

// トーナメントID
export type TournamentIdSchema = Static<ReturnType<typeof TournamentIdSchema>>
export function TournamentIdSchema(options?: StringOptions) {
	return UUIDSchema({ description: "ID", ...options })
}
