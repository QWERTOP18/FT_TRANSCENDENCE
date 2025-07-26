import { v4 as uuidv4 } from "uuid";

let users: { id: string; name: string }[] = [];

export const createUser = async (name: string) => {
  // todo databaseに保存する
  const user_id = uuidv4();
  if (users.find((user) => user.name === name)) {
    throw new DuplicateError("User already exists");
  }
  users.push({ id: user_id, name });
  return { id: user_id, name };
};

export const authenticateUser = async (name: string) => {
  const user = users.find((user) => user.name === name);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export class DuplicateError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.name = "DuplicateError";
    this.code = "DUPLICATE_USER";
  }
}

export class NotFoundError extends Error {
  code: string;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.code = "USER_NOT_FOUND";
  }
}
