import { ValueObject } from "./ValueObject";

export type TournamentRuleValue = string;

export class TournamentRule extends ValueObject<'TournamentRule', TournamentRuleValue> {

	constructor(state: TournamentRuleValue) {
		super('TournamentRule', state);
	}

	protected validate(value: TournamentRuleValue): void {
	}
}
