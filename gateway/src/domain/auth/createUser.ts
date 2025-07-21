import { v4 as uuidv4 } from "uuid";

export const createUser = async (name: string) => {
  const user_id = uuidv4();
  return { id: user_id, name };
};
