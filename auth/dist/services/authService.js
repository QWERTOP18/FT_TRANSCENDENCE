"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.NotFoundError = exports.DuplicateError = void 0;
const prisma_1 = require("./prisma");
class DuplicateError extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateError";
        this.code = "DUPLICATE_USER";
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.code = "USER_NOT_FOUND";
    }
}
exports.NotFoundError = NotFoundError;
class AuthService {
    async createUser(name) {
        try {
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { name }
            });
            if (existingUser) {
                throw new DuplicateError("User already exists");
            }
            const user = await prisma_1.prisma.user.create({
                data: { name }
            });
            return user;
        }
        catch (error) {
            if (error instanceof DuplicateError) {
                throw error;
            }
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async authenticateUser(name) {
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { name }
            });
            if (!user) {
                throw new NotFoundError("User not found");
            }
            return user;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to authenticate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUser(id) {
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new NotFoundError("User not found");
            }
            return user;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map