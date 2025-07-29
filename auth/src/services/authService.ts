import { prisma } from './prisma';
import { User } from '../types/user';

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

export class AuthService {
  async createUser(name: string): Promise<User> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { name }
      });

      if (existingUser) {
        throw new DuplicateError("User already exists");
      }

      const user = await prisma.user.create({
        data: { name }
      });

      return user;
    } catch (error) {
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async authenticateUser(name: string): Promise<User> {
    try {
      const user = await prisma.user.findUnique({
        where: { name }
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to authenticate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 
