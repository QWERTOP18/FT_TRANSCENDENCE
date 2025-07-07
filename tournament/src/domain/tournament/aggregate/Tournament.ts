import { History } from "../entities/History";
import { Participant } from "../entities/Participant";
import { BadStateError, DuplicatedError, InvalidIdError, NoRelationalError, TournamentStateError } from "../TournamentError";
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
	static create(ownerId: ParticipantId) {
		return new Tournament({
			id: new TournamentId(),
			ownerId: ownerId,
			championId: undefined,
			name: '',
			description: '',
			state: new TournamentState('reception'),
			participants: [],
			histories: []
		});
	}

	static reconstruct(props: TournamentValue) {
		return new Tournament(props);
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

	public ready(participant: Participant) {
		this.changeParticipantState(participant, new ParticipantState('ready'));
	}

	public cancel(participant: Participant) {
		this.changeParticipantState(participant, new ParticipantState('pending'));
	}

	public start(participant1: Participant, participant2: Participant) {
		this.changeParticipantState(participant1, new ParticipantState('in_progress'));
		this.changeParticipantState(participant2, new ParticipantState('in_progress'));
	}

	public reRound() {
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new TournamentStateError("開催中のトーナメントでのみ再ラウンドできます");
		if (this.isOverRound() == false)
			throw new BadStateError("バトルが終了していません");
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		battledParticipants.forEach((p) => {
			p.become(new ParticipantState('pending'));
		});
	}

	public addHistory(history: History) {
		if (history.tournamentId != this._props.id)
			throw new InvalidIdError("トーナメントIDと履歴のIDが一致しません")
		const winner = this.getParticipantById(history.getWinnerId());
		const loser = this.getParticipantById(history.getLoserId());
		if (!winner || !loser)
			throw new NoRelationalError("トーナメントに属していない参加者です");
		winner.become(new ParticipantState('battled'));
		loser.become(new ParticipantState('eliminated'));
		this._props.histories.push(history);
	}

	public carryUpOneParticipant() {
		const pendingParticipants = this.getParticipantsByState(new ParticipantState('pending'));
		if (pendingParticipants.length == 0)
			throw new BadStateError("昇格させる参加者がいません");
		if (pendingParticipants.length % 2 != 1)
			throw new BadStateError("昇格させる参加者は奇数人でなければなりません");
		const target = pendingParticipants[Math.floor(Math.random() * pendingParticipants.length)];
		target.become(new ParticipantState('battled'));
	}

	public setChampion() {
		if (this.canSetChampion() == false)
			throw new BadStateError("チャンピオンを決定できません");
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		const champion = battledParticipants[0];
		if (!champion)
			throw new BadStateError("バトル済みの参加者が1人ではありません");
		this._props.championId = champion.id;
		champion.become(new ParticipantState('champion'));
		this.close();
	}


	public isOverRound() {
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		const eliminatedParticipants = this.getParticipantsByState(new ParticipantState('eliminated'));
		const doneParticipantsLength = battledParticipants.length + eliminatedParticipants.length;
		return doneParticipantsLength == this._props.participants.length;
	}

	public canSetChampion() {
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new TournamentStateError("開催中のトーナメントでのみ決定できます");
		if (this._props.participants.length < 2)
			throw new BadStateError("参加者が2人以上必要です");
		if (this.isOverRound() == false)
			throw new BadStateError("バトルが終了していません");
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		if (battledParticipants.length != 1)
			throw new BadStateError("バトル済みの参加者が1人ではありません");
		return true;
	}

	private changeParticipantState(participant: Participant, state: ParticipantState) {
		const target = this.getParticipant(participant);
		if (!target)
			throw new NoRelationalError("トーナメントに属していない参加者です");
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new TournamentStateError("開催中のトーナメントでのみ変更可能です")
		target.become(state);
	}

	/** ゲッター */
	public getParticipant(participant: Participant) {
		return this.getParticipantById(participant.id);
	}

	public getParticipantById(id: ParticipantId) {
		return this._props.participants.find((p) => p.id.equals(id));
	}

	public getParticipantsByState(state: ParticipantState) {
		return this._props.participants.filter((p) => p.state.equals(state));
	}

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
