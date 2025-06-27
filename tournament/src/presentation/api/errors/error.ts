import { createError } from '@fastify/error';


export const NotImplementedError = createError('TRT_ERR_NOT_IMPLEMENTED', 'This feature is not implemented.', 500)
