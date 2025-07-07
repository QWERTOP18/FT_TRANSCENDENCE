import { HistoryId } from "../value-objects/HistoryId";
import { ParticipantScore } from "../value-objects/ParticipantScore";
import { TournamentId } from "../value-objects/TournamentId";

export class History {
	constructor(private _props: {
		readonly id: HistoryId,
		readonly tournamentId: TournamentId,
		winner: ParticipantScore,
		loser: ParticipantScore,
		created_at: Date,
	}) { }

	/** セッター */

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
