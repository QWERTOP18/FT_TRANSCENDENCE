import { FastifyError, FastifyErrorSchema } from "../FastifyError";

export interface BattleErrorSchema extends FastifyErrorSchema { }

export class BattleError extends FastifyError {

	constructor(json: BattleErrorSchema, endpoint?: string) {
		super(json, endpoint);
		this.name = 'BattleError';
	}
}

