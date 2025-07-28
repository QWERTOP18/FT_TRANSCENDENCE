import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";

export type GameRoomSchema = Static<ReturnType<typeof GameRoomSchema>>;
export const GameRoomSchema = () => {
  return Type.Object({
    room_id: Type.String({ description: "部屋のID" }),
    player1_id: Type.String({ description: "プレイヤー1のユーザID" }),
    player2_id: Type.String({ description: "プレイヤー2のユーザID" }),
  });
};
