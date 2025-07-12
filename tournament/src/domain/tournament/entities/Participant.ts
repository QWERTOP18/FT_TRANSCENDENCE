import { UsageError } from "../TournamentError";
import { ParticipantId } from "../value-objects/ParticipantId";
import { ParticipantState } from "../value-objects/ParticipantState";
import { TournamentId } from "../value-objects/TournamentId";

export type ParticipantValue = {
	readonly id: ParticipantId,
	readonly tournamentId: TournamentId,
	readonly externalId: string,
	state: ParticipantState,
}

export class Participant {
	constructor(private _props: ParticipantValue) { }

	public static create(
		tournamentId: TournamentId,
		externalId: string) {
		return new Participant({
			id: new ParticipantId(),
			tournamentId,
			externalId,
			state: new ParticipantState('pending'),
		});
	}

	public static reconstruct(props: ParticipantValue) {
		return new Participant(props);
	}

	public become(state: ParticipantState) {
		if (this.canBecome(state) == false)
			throw new UsageError(`${state.value}に遷移することはできません`);
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
