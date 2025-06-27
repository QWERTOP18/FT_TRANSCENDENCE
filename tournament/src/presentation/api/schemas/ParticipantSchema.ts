import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "./OtherSchema";
import { TournamentIdSchema } from "./TournamentSchema";

export const ParticipantSchema = (options?: ObjectOptions) => {
	return Type.Object({
		id: UUIDSchema({ description: "ID" }),
		tournament_id: TournamentIdSchema({ description: "トーナメント ID" }),
		name: Type.String({description: "名前"}),
		external_id: Type.String({description: "外部ID - トーナメントユーザーと外部のユーザー情報の紐付け用"}),
	}, {description: "参加者", ...options})
}
export type ParticipantSchema = Static<ReturnType<typeof ParticipantSchema>>
