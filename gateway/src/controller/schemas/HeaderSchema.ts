import { Static, Type } from "@sinclair/typebox";

export type CommonHeaderSchema = Static<ReturnType<typeof CommonHeaderSchema>>;
export const CommonHeaderSchema = () => {
  return Type.Object({
    "X-User-Id": Type.String({ description: "ユーザーID" }),
  });
};
