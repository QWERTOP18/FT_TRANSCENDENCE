import { ValueObject } from "./ValueObject";

export type ParticipantStateValue = 'pending'
	| 'ready'
	| 'in_progress'
	| 'battled'
	| 'eliminated'
	| 'champion'
	;

export class ParticipantState extends ValueObject<'ParticipantState', ParticipantStateValue> {

	constructor(state: ParticipantStateValue) {
		super('ParticipantState', state);
	}

	protected validate(value: ParticipantStateValue): void {
		const state = ['pending', 'ready', 'in_progress', 'battled', 'eliminated', 'champion'];
		if (state.some((state) => state === value) == false)
			throw new Error('参加者のstateの形式が不正です');
	}
}
