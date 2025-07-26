import { ObjectOptions, SchemaOptions, Static, Type } from "@sinclair/typebox";
import { OrderNumSchema, UUIDSchema } from "./OtherSchema";
import { ParticipantSchema } from "./ParticipantSchema";
import { TournamentIdSchema } from "./TournamentSchema";

// マッチ
export function MatchSchema(options?: ObjectOptions) {
  return Type.Object(
    {
      id: UUIDSchema({ description: "ID" }),
      tournament_id: TournamentIdSchema({ description: "トーナメントID" }),
      order: OrderNumSchema({ description: "マッチを並び替える順番" }),
      round: Type.Number({ minimum: 0, description: "ラウンド数" }),
      status: MatchStatusSchema(),
      participants: Type.Array(ParticipantSchema(), {
        maxItems: 2,
        description: "対戦相手",
      }),
      winner: ParticipantSchema({ description: "勝者" }),
      loser: ParticipantSchema({ description: "敗者" }),
    },
    { description: "マッチ", ...options }
  );
}
export type MatchSchema = Static<ReturnType<typeof MatchSchema>>;

// マッチ状況
export function MatchStatusSchema(options?: SchemaOptions) {
  return Type.Union(
    [Type.Literal("ready"), Type.Literal("in_progress"), Type.Literal("done")],
    {
      description:
        "マッチの状況 - ready: 対戦開始可能, in_progress: 対戦中, done: 対戦終了",
      ...options,
    }
  );
}
export type MatchStatusSchema = Static<ReturnType<typeof MatchStatusSchema>>;
