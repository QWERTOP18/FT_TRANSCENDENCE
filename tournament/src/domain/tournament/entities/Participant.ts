import { BadStateError } from "../TournamentError";
import { ParticipantId } from "../value-objects/ParticipantId";
import { ParticipantState } from "../value-objects/ParticipantState";
import { TournamentId } from "../value-objects/TournamentId";

export class Participant {
	constructor(private _props: {
		readonly id: ParticipantId,
		readonly tournamentId: TournamentId,
		readonly externalId: string,
		state: ParticipantState,
	}) { }

	public become(state: ParticipantState) {
		if (this.canBecome(state) == false)
			throw new BadStateError(`${state.value}に遷移することはできません`);
		this._props.state = state;
	}

	public canBecome(state: ParticipantState) {
		const stateTransitions = {
			pending: ['ready', 'battled'],
			ready: ['in_progress', 'pending'],
			in_progress: ['battled', 'eliminated'],
			battled: ['pending', 'champion'],
			eliminated: [],
			champion: []
		} as const;

		const canBecome = stateTransitions[this._props.state.value]
			.some((value) => state.equals(new ParticipantState(value)));
		return canBecome;
	}

	/** ゲッター */
	get id() {
		return this._props.id;
	}
	get tournamentId() {
		return this._props.tournamentId;
	}
	get externalId() {
		return this._props.externalId;
	}
	get state() {
		return this._props.state;
	}
}
