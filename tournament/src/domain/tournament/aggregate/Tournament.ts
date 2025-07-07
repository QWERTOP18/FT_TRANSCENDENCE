import { History } from "../entities/History";
import { Participant } from "../entities/Participant";
import { DuplicatedError, InvalidIdError, NoRelationalError, TournamentStateError } from "../TournamentError";
import { ParticipantId } from "../value-objects/ParticipantId";
import { ParticipantState } from "../value-objects/ParticipantState";
import { TournamentId } from "../value-objects/TournamentId";
import { TournamentState } from "../value-objects/TournamentState";

export type TournamentValue = {
	readonly id: TournamentId,
	readonly ownerId: ParticipantId,
	championId?: ParticipantId,
	name: string,
	description: string,
	state: TournamentState,
	participants: Array<Participant>,
	histories: Array<History>
}

export class Tournament {

	private constructor(private _props: TournamentValue) { }

	/** 構築 */
	static create(props: TournamentValue) {
		return new Tournament(props);
	}

	static reconstruct(props: TournamentValue) {
		return new Tournament(props);
	}

	/** セッター */
	public setChampionId(id: ParticipantId) {
		this._props.championId = id;
	}

	public changeName(name: string) {
		this._props.name = name;
	}

	public changeDescription(description: string) {
		this._props.description = description;
	}

	public open() {
		if (this._props.state.equals(new TournamentState('reception')) == false)
			throw new TournamentStateError('予約中のトーナメントのみ開催できます');
		this._props.state = new TournamentState('open');
	}

	public close() {
		this._props.state = new TournamentState('close');
	}

	public addParticipant(participant: Participant) {
		if (participant.tournamentId != this._props.id)
			throw new InvalidIdError("トーナメントIDと参加者のIDが一致しません")
		if (this.getParticipant(participant))
			throw new DuplicatedError("すでに登録されています。")
		this._props.participants.push(participant);
	}

	public addHistory(history: History) {
		if (history.tournamentId != this._props.id)
			throw new InvalidIdError("トーナメントIDと履歴のIDが一致しません")
		const winner = this.getParticipantById(history.getWinnerId());
		const loser = this.getParticipantById(history.getLoserId());

		this._props.histories.push(history);
	}

	public changeParticipantState(participant: Participant, state: ParticipantState) {
		const target = this.getParticipant(participant);
		if (!target)
			throw new NoRelationalError("トーナメントに属していない参加者です");
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new TournamentStateError("開催中のトーナメントでのみ変更可能です")
		target.become(state);
	}

	/** ツール */
	public getParticipant(participant: Participant) {
		return this._props.participants.find((p) => p.id.equals(participant.id));
	}

	public getParticipantById(id: ParticipantId) {
		return this._props.participants.find((p) => p.id.equals(id));
	}

	/** ゲッター */
	get id() {
		return this._props.id;
	}

	get championId() {
		return this._props.championId;
	}

	get ownerId() {
		return this._props.ownerId;
	}

	get name() {
		return this._props.name;
	}

	get description() {
		return this._props.description;
	}

	get state() {
		return this._props.state;
	}

	get participants() {
		return this._props.participants;
	}

	get histories() {
		return this._props.histories;
	}
}
