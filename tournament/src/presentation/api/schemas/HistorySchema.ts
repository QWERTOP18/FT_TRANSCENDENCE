import { ObjectOptions, Static, Type } from "@sinclair/typebox";
import { ScoreSchema, UUIDSchema } from "./OtherSchema";
import { ParticipantIdSchema } from "./ParticipantSchema";
import { TournamentIdSchema } from "./TournamentSchema";

// 履歴
export type HistorySchema = Static<ReturnType<typeof HistorySchema>>
export const HistorySchema = (options?: ObjectOptions) => {
	return Type.Object({
		id: HistoryIdSchema({ description: "履歴ID" }),
		tournament_id: TournamentIdSchema({ description: "トーナメント ID" }),
		winner: Type.Object({
			id: ParticipantIdSchema({ description: "勝者の参加者ID" }),
			score: ScoreSchema({ description: "勝者のスコア" }),
		}),
		loser: Type.Object({
			id: ParticipantIdSchema({ description: "敗者の参加者ID" }),
			score: ScoreSchema({ description: "敗者のスコア" }),
		}),
		created_at: Type.String({ description: "履歴の作成日時", format: 'date-time' }),
	}, { description: "トーナメントの履歴", ...options })
}

export type HistoryIdSchema = Static<ReturnType<typeof HistoryIdSchema>>
export const HistoryIdSchema = (options?: ObjectOptions) => {
	return UUIDSchema({ description: "履歴ID", ...options })
}
