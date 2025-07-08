import { ValueObject } from "./ValueObject";

export type TournamentStateValue = 'reception' | 'open' | 'close';
export class TournamentState extends ValueObject<'TournamentState', TournamentStateValue> {
	constructor(state: TournamentStateValue) {
		super('TournamentState', state);
	}

	protected validate(value: TournamentStateValue): void {
	}
}
