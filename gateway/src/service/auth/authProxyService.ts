import axios, { AxiosResponse } from "axios";
import { config } from "../../config/config";
import { User } from "./AuthService";

export interface AuthProxyService {
  createUser(name: string): Promise<User>;
  authenticateUser(name: string): Promise<User>;
  getUser(id: string): Promise<User>;
}

interface AuthServiceUser {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthProxyServiceImpl implements AuthProxyService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.authURL;
  }

  async createUser(name: string): Promise<User> {
    try {
      console.log(
        `[AuthProxy] Creating user: ${name} at ${this.baseURL}/auth/signup`
      );

      const response: AxiosResponse<AuthServiceUser> = await axios.post(
        `${this.baseURL}/auth/signup`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`[AuthProxy] Response received:`, response.data);

      // Auth ServiceのレスポンスをgatewayのUser形式に変換
      return {
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      console.error(`[AuthProxy] Error creating user:`, error);

      if (axios.isAxiosError(error)) {
        console.error(`[AuthProxy] Axios error details:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 400) {
          throw new DuplicateError("User already exists");
        }
        throw new Error(
          `Auth service error: ${error.response?.data?.message || error.message}`
        );
      }
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async authenticateUser(name: string): Promise<User> {
    try {
      const response: AxiosResponse<AuthServiceUser> = await axios.post(
        `${this.baseURL}/auth/authenticate`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Auth ServiceのレスポンスをgatewayのUser形式に変換
      return {
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundError("User not found");
        }
        throw new Error(
          `Auth service error: ${error.response?.data?.message || error.message}`
        );
      }
      throw new Error(
        `Failed to authenticate user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const response: AxiosResponse<AuthServiceUser> = await axios.get(
        `${this.baseURL}/auth/users/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Auth ServiceのレスポンスをgatewayのUser形式に変換
      return {
        id: response.data.id,
        name: response.data.name,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new NotFoundError("User not found");
        }
        throw new Error(
          `Auth service error: ${error.response?.data?.message || error.message}`
        );
      }
      throw new Error(
        `Failed to get user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

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
