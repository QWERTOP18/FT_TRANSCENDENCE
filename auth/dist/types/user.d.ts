export interface User {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserRequest {
    name: string;
}
export interface AuthenticateUserRequest {
    name: string;
}
export interface CreateUserResponse {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface AuthenticateUserResponse {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}
//# sourceMappingURL=user.d.ts.map