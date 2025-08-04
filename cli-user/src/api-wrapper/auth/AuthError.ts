import { FastifyError, FastifyErrorSchema } from "../FastifyError";

export interface AuthErrorSchema extends FastifyErrorSchema { }

export class AuthError extends FastifyError {

	constructor(json: AuthErrorSchema, endpoint?: string, method?: string) {
		super(json, endpoint, method);
		this.name = 'AuthError';
	}
}
