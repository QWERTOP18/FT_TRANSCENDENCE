import { ObjectOptions, ReturnType, Static, Type } from "@sinclair/typebox";

export type GameRoomSchema = Static<ReturnType<typeof GameRoomSchema>>;
export const GameRoomSchema = () => {
  return Type.Object({
    room_id: Type.String({ description: "部屋のID" }),
    token_player1: Type.String({ description: "プレイヤー1のトークン" }),
    token_player2: Type.String({ description: "プレイヤー2のトークン" }),
    token_watcher: Type.String({ description: "観戦者のトークン" }),
  });
};
