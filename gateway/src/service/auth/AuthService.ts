import {
  AuthProxyServiceImpl,
  DuplicateError,
  NotFoundError,
} from "./authProxyService";

export interface User {
  id: string;
  name: string;
}

// プロキシサービスを使用
const authProxyService = new AuthProxyServiceImpl();

export const createUser = async (name: string): Promise<User> => {
  return await authProxyService.createUser(name);
};

export const authenticateUser = async (name: string): Promise<User> => {
  return await authProxyService.authenticateUser(name);
};

export const getUser = async (id: string): Promise<User> => {
  return await authProxyService.getUser(id);
};

// エラークラスを再エクスポート
export { DuplicateError, NotFoundError };
