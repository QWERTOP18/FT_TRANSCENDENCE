import { HistoryId } from "../value-objects/HistoryId";
import { ParticipantScore } from "../value-objects/ParticipantScore";
import { TournamentId } from "../value-objects/TournamentId";


export type HistoryValue = {
	readonly id: HistoryId,
	readonly tournamentId: TournamentId,
	winner: ParticipantScore,
	loser: ParticipantScore,
	created_at: Date,
}

export class History {
	private constructor(private _props: HistoryValue) { }

	public static create(
		tournamentId: TournamentId,
		winner: ParticipantScore,
		loser: ParticipantScore,
	) {
		return new History({
			id: new HistoryId(),
			tournamentId,
			winner,
			loser,
			created_at: new Date(),
		});
	}

	public static reconstruct(props: HistoryValue) {
		return new History(props);
	}

	/** ゲッター */
	get id() {
		return this._props.id;
	}

	get tournamentId() {
		return this._props.tournamentId;
	}

	public getWinnerId() {
		return this._props.winner.id;
	}

	public getLoserId() {
		return this._props.loser.id;
	}

	get created_at() {
		return this._props.created_at;
	}
}
