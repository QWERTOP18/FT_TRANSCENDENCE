"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.UserResponseSchema = exports.AuthenticateUserRequestSchema = exports.CreateUserRequestSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.CreateUserRequestSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({
        description: 'ユーザー名',
        minLength: 1,
        maxLength: 50
    })
});
exports.AuthenticateUserRequestSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({
        description: 'ユーザー名',
        minLength: 1,
        maxLength: 50
    })
});
exports.UserResponseSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({
        description: 'ユーザーID'
    }),
    name: typebox_1.Type.String({
        description: 'ユーザー名'
    }),
    createdAt: typebox_1.Type.String({
        description: '作成日時',
        format: 'date-time'
    }),
    updatedAt: typebox_1.Type.String({
        description: '更新日時',
        format: 'date-time'
    })
});
exports.ErrorResponseSchema = typebox_1.Type.Object({
    error: typebox_1.Type.String({
        description: 'エラーコード'
    }),
    message: typebox_1.Type.String({
        description: 'エラーメッセージ'
    }),
    statusCode: typebox_1.Type.Number({
        description: 'HTTPステータスコード'
    })
});
//# sourceMappingURL=userSchema.js.map