import { FastifyError, FastifyErrorSchema } from "../FastifyError";

export interface BattleErrorSchema extends FastifyErrorSchema { }

export class BattleError extends FastifyError {

	constructor(json: BattleErrorSchema, endpoint?: string, method?: string) {
		super(json, endpoint, method);
		this.name = 'BattleError';
	}
}

