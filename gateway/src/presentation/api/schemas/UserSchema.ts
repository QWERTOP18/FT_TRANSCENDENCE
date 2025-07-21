import { Static, Type } from "@sinclair/typebox";

export type UserSchema = Static<ReturnType<typeof UserSchema>>;
export const UserSchema = () => {
  return Type.Object({
    id: Type.String({ description: "ユーザーID" }),
    name: Type.String({ description: "ユーザー名" }),
  });
};
