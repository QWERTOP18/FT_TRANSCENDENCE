import { FastifyError, FastifyErrorSchema } from "../FastifyError";

export interface TournamentErrorSchema extends FastifyErrorSchema { }

export class TournamentError extends FastifyError {

	constructor(json: TournamentErrorSchema, endpoint?: string, method?: string) {
		super(json, endpoint, method);
		this.name = 'TournamentError';
	}
}
