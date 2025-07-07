import { UUID } from './UUID';

export class TournamentId extends UUID<'TournamentId'> {
	constructor(value: string) {
		super('TournamentId', value);
	}
}
