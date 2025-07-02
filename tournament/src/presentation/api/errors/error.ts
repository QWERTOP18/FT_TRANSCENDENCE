import { createError } from '@fastify/error';


export const NotImplementedError = createError('TRT_ERR_NOT_IMPLEMENTED', 'この機能は実装されていません', 500)
