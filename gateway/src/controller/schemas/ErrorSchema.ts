import { Static, Type } from "@sinclair/typebox";

export type ErrorSchema = Static<ReturnType<typeof ErrorSchema>>;
export const ErrorSchema = () => {
  return Type.Object({
    error: Type.String({ description: "エラーメッセージ" }),
  });
};
