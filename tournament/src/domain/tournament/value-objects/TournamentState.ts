import { ValueObject } from "./ValueObject";

type TournamentStateValue = 'reception' | 'open' | 'close';
export class TournamentState extends ValueObject<'TournamentState', TournamentStateValue> {
	constructor(state: TournamentStateValue) {
		super('TournamentState', state);
	}

	protected validate(value: TournamentStateValue): void {
	}
}
