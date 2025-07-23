import { ValueObject } from "./ValueObject";

export type TournamentRuleValue = string;

export class TournamentRule extends ValueObject<'TournamentRule', TournamentRuleValue> {

	constructor(state: TournamentRuleValue) {
		super('TournamentRule', state);
	}

	protected validate(value: TournamentRuleValue): void {
		const state = ['simple'];
		if (state.some((state) => state === value) == false)
			throw new Error('トーナメントルールの形式が不正です');
	}
}
