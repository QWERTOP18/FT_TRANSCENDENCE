export declare const CreateUserRequestSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
}>;
export declare const AuthenticateUserRequestSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
}>;
export declare const UserResponseSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    createdAt: import("@sinclair/typebox").TString;
    updatedAt: import("@sinclair/typebox").TString;
}>;
export declare const ErrorResponseSchema: import("@sinclair/typebox").TObject<{
    error: import("@sinclair/typebox").TString;
    message: import("@sinclair/typebox").TString;
    statusCode: import("@sinclair/typebox").TNumber;
}>;
//# sourceMappingURL=userSchema.d.ts.map