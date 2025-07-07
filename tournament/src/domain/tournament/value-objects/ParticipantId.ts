import { UUID } from './UUID';

export class ParticipantId extends UUID<'ParticipantId'> {
	constructor(value: string) {
		super('ParticipantId', value);
	}
}
