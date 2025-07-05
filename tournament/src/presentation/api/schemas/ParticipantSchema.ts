import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "./OtherSchema";
import { TournamentIdSchema } from "./TournamentSchema";

export type ParticipantSchema = Static<ReturnType<typeof ParticipantSchema>>
export const ParticipantSchema = (options?: ObjectOptions) => {
	return Type.Object({
		id: ParticipantIdSchema({ description: "参加者ID" }),
		tournament_id: TournamentIdSchema({ description: "トーナメント ID" }),
		external_id: Type.String({ description: "外部ID - トーナメントユーザーと外部のユーザー情報の紐付け用" }),
		state: ParticipantStateSchema(),
	}, { description: "参加者", ...options })
}

export type ParticipantIdSchema = Static<ReturnType<typeof ParticipantIdSchema>>
export function ParticipantIdSchema(options?: ObjectOptions) {
	return UUIDSchema({ description: "参加者ID", ...options })
}

export type ParticipantStateSchema = Static<ReturnType<typeof ParticipantStateSchema>>
export function ParticipantStateSchema(options?: ObjectOptions) {
	return Type.Union([
		Type.Literal('pending'),
		Type.Literal('ready'),
		Type.Literal('in_progress'),
		Type.Literal('battled'),
		Type.Literal('eliminated'),
		Type.Literal('champion'),
	], {
		description: "参加者の状態 - pending: 参加待ち, ready: 準備完了, in_progress: 対戦中, battled: 対戦済み, eliminated: 敗退, champion: 優勝",
		...options
	})
}
