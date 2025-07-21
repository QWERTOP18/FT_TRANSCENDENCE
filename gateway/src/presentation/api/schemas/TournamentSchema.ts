import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";

export type TournamentSchema = Static<ReturnType<typeof TournamentSchema>>;
export const TournamentSchema = () => {
  return Type.Object({
    id: Type.String({ description: "トーナメントID" }),
    name: Type.String({ description: "トーナメント名" }),
    description: Type.String({ description: "トーナメントの説明" }),
    max_num: Type.Number({ description: "最大参加者数" }),
    state: Type.String({ description: "トーナメントの状態" }),
    created_at: Type.Optional(
      Type.String({ format: "date-time", description: "作成日時" })
    ),
  });
};

export type CreateTournamentSchema = Static<
  ReturnType<typeof CreateTournamentSchema>
>;
export const CreateTournamentSchema = () => {
  return Type.Object({
    name: Type.String({ description: "トーナメント名" }),
    description: Type.String({ description: "トーナメントの説明" }),
    max_num: Type.Number({
      description: "最大参加者数",
      minimum: 2,
      maximum: 32,
    }),
  });
};

export type ParticipantSchema = Static<ReturnType<typeof ParticipantSchema>>;
export const ParticipantSchema = () => {
  return Type.Object({
    id: Type.String({ description: "参加者ID" }),
    user_id: Type.String({ description: "ユーザーID" }),
    tournament_id: Type.String({ description: "トーナメントID" }),
    state: Type.String({ description: "参加者の状態" }),
    score: Type.Optional(Type.Number({ description: "スコア" })),
    created_at: Type.Optional(
      Type.String({ format: "date-time", description: "参加日時" })
    ),
  });
};

export type HistorySchema = Static<ReturnType<typeof HistorySchema>>;
export const HistorySchema = () => {
  return Type.Object({
    id: Type.String({ description: "履歴ID" }),
    tournament_id: Type.String({ description: "トーナメントID" }),
    winner_id: Type.String({ description: "勝者のユーザーID" }),
    loser_id: Type.String({ description: "敗者のユーザーID" }),
    winner_score: Type.Number({ description: "勝者のスコア" }),
    loser_score: Type.Number({ description: "敗者のスコア" }),
    round: Type.Number({ description: "ラウンド番号" }),
    created_at: Type.Optional(
      Type.String({ format: "date-time", description: "試合日時" })
    ),
  });
};

export type ErrorSchema = Static<ReturnType<typeof ErrorSchema>>;
export const ErrorSchema = () => {
  return Type.Object({
    error: Type.String({ description: "エラーメッセージ" }),
  });
};
