import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";

export type GameRoomSchema = Static<ReturnType<typeof GameRoomSchema>>;
export const GameRoomSchema = () => {
  return Type.Object({
    room_id: Type.String({ description: "部屋のID" }),
    tournament_id: Type.String({ description: "トーナメントのID" }),
    player1_id: Type.String({ description: "プレイヤー1のID" }),
    player2_id: Type.String({ description: "プレイヤー2のID" }),
  });
};

export const CreateGameRoomSchema = () => {
  return Type.Object({
    tournament_id: Type.String({ description: "トーナメントのID" }),
    player1_id: Type.String({ description: "プレイヤー1のID" }),
    player2_id: Type.String({ description: "プレイヤー2のID" }),
    winning_score: Type.Number({ description: "勝利スコア" , default: 5}),
  });
};
