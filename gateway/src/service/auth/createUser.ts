import { v4 as uuidv4 } from "uuid";

export const createUser = async (name: string) => {
  // todo databaseに保存する
  const user_id = uuidv4();
  return { id: user_id, name };
};
