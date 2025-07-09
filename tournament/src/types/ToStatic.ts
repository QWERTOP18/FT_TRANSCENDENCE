import { Static, TSchema } from "@sinclair/typebox";

export type ToStatic<T> = T extends TSchema ? Static<T> : undefined;
