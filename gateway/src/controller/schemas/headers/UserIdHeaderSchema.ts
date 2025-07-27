import { Type } from "@sinclair/typebox";

export const UserIdHeaderSchema = Type.Object({
  "x-user-id": Type.String({ description: "ユーザーID", minLength: 1 }),
});
