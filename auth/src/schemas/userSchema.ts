import { Type } from '@sinclair/typebox';

export const CreateUserRequestSchema = Type.Object({
  name: Type.String({
    description: 'ユーザー名',
    minLength: 1,
    maxLength: 50
  })
});

export const AuthenticateUserRequestSchema = Type.Object({
  name: Type.String({
    description: 'ユーザー名',
    minLength: 1,
    maxLength: 50
  })
});

export const UserResponseSchema = Type.Object({
  id: Type.String({
    description: 'ユーザーID'
  }),
  name: Type.String({
    description: 'ユーザー名'
  }),
  createdAt: Type.String({
    description: '作成日時',
    format: 'date-time'
  }),
  updatedAt: Type.String({
    description: '更新日時',
    format: 'date-time'
  })
});

export const ErrorResponseSchema = Type.Object({
  error: Type.String({
    description: 'エラーコード'
  }),
  message: Type.String({
    description: 'エラーメッセージ'
  }),
  statusCode: Type.Number({
    description: 'HTTPステータスコード'
  })
}); 
