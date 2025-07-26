import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

export interface User {
  id: string;
  name: string;
}

const USERS_FILE_PATH = path.join(process.cwd(), "data/users.json");

// データディレクトリが存在しない場合は作成
const ensureDataDirectory = () => {
  const dataDir = path.dirname(USERS_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// ユーザーデータを読み込む
const loadUsers = (): User[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load users:", error);
  }
  return [];
};

// ユーザーデータを保存する
const saveUsers = (users: User[]): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Failed to save users:", error);
  }
};

// 初期化時にユーザーデータを読み込む
let users: User[] = loadUsers();

export const createUser = async (name: string) => {
  // todo databaseに保存する
  const user_id = uuidv4();
  if (users.find((user) => user.name === name)) {
    throw new DuplicateError("User already exists");
  }
  const newUser = { id: user_id, name };
  users.push(newUser);
  saveUsers(users); // 永続化
  return newUser as User;
};

export const authenticateUser = async (name: string) => {
  const user = users.find((user) => user.name === name);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user as User;
};

export const getUser = async (id: string) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user as User;
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
