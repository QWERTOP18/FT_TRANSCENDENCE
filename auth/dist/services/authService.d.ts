import { User } from '../types/user';
export declare class DuplicateError extends Error {
    code: string;
    constructor(message: string);
}
export declare class NotFoundError extends Error {
    code: string;
    constructor(message: string);
}
export declare class AuthService {
    createUser(name: string): Promise<User>;
    authenticateUser(name: string): Promise<User>;
    getUser(id: string): Promise<User>;
}
//# sourceMappingURL=authService.d.ts.map