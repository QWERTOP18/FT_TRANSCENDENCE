import { History } from "../entities/History";
import { Participant } from "../entities/Participant";
import { InternalError, UsageError } from "../TournamentError";
import { ParticipantId } from "../value-objects/ParticipantId";
import { ParticipantState } from "../value-objects/ParticipantState";
import { TournamentId } from "../value-objects/TournamentId";
import { TournamentRule } from "../value-objects/TournamentRule";
import { TournamentState } from "../value-objects/TournamentState";

export type TournamentValue = {
	readonly id: TournamentId,
	readonly ownerId: ParticipantId,
	championId?: ParticipantId,
	name: string,
	description: string,
	max_num: number,
	state: TournamentState,
	rule: TournamentRule,
	participants: Array<Participant>,
	histories: Array<History>
}

export class Tournament {

	private constructor(private _props: TournamentValue) { }

	/** 構築 */
	static create(props: {
		name?: string,
		description?: string,
		max_num: number,
		ownerExternalId: string,
		ownerName: string,
		rule: TournamentRule,
	}) {
		const tournamentId = new TournamentId();
		const owner = Participant.create(tournamentId, props.ownerExternalId, props.ownerName)
		return new Tournament({
			id: new TournamentId(),
			ownerId: owner.id,
			championId: undefined,
			name: props.name ?? '',
			description: props.description ?? '',
			max_num: props.max_num,
			state: new TournamentState('reception'),
			rule: props.rule,
			participants: [owner],
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
			throw new UsageError('予約中のトーナメントのみ開催できます');
		if (this._props.participants.length < 2)
			throw new UsageError('開催するためには二人以上の参加が必要です')
		this._props.state = new TournamentState('open');

		// トーナメント開始時にpendingが奇数の場合、1人を昇格させる
		if (this.shouldCarryUpOneParticipant()) {
			this.carryUpOneParticipant();
		}
	}

	public close() {
		this._props.state = new TournamentState('close');
	}

	public addParticipant(participant: Participant) {
		if (participant.tournamentId.equals(this._props.id) == false)
			throw new UsageError("トーナメントIDと参加者のIDが一致しません")
		if (this.getParticipant(participant))
			throw new UsageError("すでに登録されています。")
		if (this.getParticipantByExternalId(participant.externalId))
			throw new UsageError("すでに登録されいてるユーザーです。")
		if (this.canModifyTournament() == false)
			throw new UsageError("開催中のため参加者を追加することはできません。")
		if (this.max_num == this.participants.length)
			throw new UsageError("これ以上参加者を追加することはできません。")
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

	public startBattle(participant1: Participant, participant2: Participant) {
		if (participant1.equals(participant2))
			throw new UsageError("同じ参加者を指定することはできません");
		this.changeParticipantState(participant1, new ParticipantState('in_progress'));
		this.changeParticipantState(participant2, new ParticipantState('in_progress'));
	}

	public cancelBattle(participant1: Participant, participant2: Participant) {
		if (participant1.equals(participant2))
			throw new UsageError("同じ参加者を指定することはできません");
		this.changeParticipantState(participant1, new ParticipantState('pending'));
		this.changeParticipantState(participant2, new ParticipantState('pending'));
	}

	public endBattle(history: History) {
		console.log("Ending battle for tournament:", this._props.id.value);
		this.addHistory(history);
		
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		const eliminatedParticipants = this.getParticipantsByState(new ParticipantState('eliminated'));
		const pendingParticipants = this.getParticipantsByState(new ParticipantState('pending'));
		
		console.log("Tournament state after battle:", {
			battled: battledParticipants.length,
			eliminated: eliminatedParticipants.length,
			pending: pendingParticipants.length,
			total: this._props.participants.length
		});
		try {
			
			if (this.isOverRound() == false) {
				console.log("Round not over yet, returning");
				return;
			}
			
			if (this.canSetChampion()) {
				console.log("Can set champion, setting champion");
				this.setChampion();
				this.close();
			}
			else {
				console.log("Cannot set champion, doing reRound");
				this.reRound();
				if (this.shouldCarryUpOneParticipant()) {
					console.log("Should carry up one participant");
					this.carryUpOneParticipant();
				}
			}
		} catch (error) {
			console.error(`Error in endBattle: ${error}`);
		}
	}

	private shouldCarryUpOneParticipant() {
		const pendingParticipants = this.getParticipantsByState(new ParticipantState('pending'));
		if (pendingParticipants.length == 0)
			return false;
		if (pendingParticipants.length % 2 != 1)
			return false;
		return true;
	}

	public reRound() {
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new UsageError("開催中のトーナメントでのみ再ラウンドできます");
		if (this.isOverRound() == false)
			throw new UsageError("バトルが終了していません");
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		console.log("reRound", battledParticipants);
		battledParticipants.forEach((p) => {
			p.become(new ParticipantState('pending'));
		});
	}

	public addHistory(history: History) {
		if (history.tournamentId.equals(this._props.id) == false)
			throw new UsageError("トーナメントIDと履歴のIDが一致しません")
		const winner = this.getParticipantById(history.getWinnerId());
		const loser = this.getParticipantById(history.getLoserId());
		if (!winner || !loser)
			throw new UsageError("トーナメントに属していない参加者です");
		if (winner.equals(loser))
			throw new UsageError("同じ参加者を指定することはできません");
		if (winner.state.equals(new ParticipantState('in_progress')) == false)
			throw new UsageError("バトル中の参加者ではありません");
		if (loser.state.equals(new ParticipantState('in_progress')) == false)
			throw new UsageError("バトル中の参加者ではありません");
		winner.become(new ParticipantState('battled'));
		loser.become(new ParticipantState('eliminated'));
		this._props.histories.push(history);
	}

	public carryUpOneParticipant() {
		const pendingParticipants = this.getParticipantsByState(new ParticipantState('pending'));
		if (pendingParticipants.length == 0)
			throw new UsageError("昇格させる参加者がいません");
		if (pendingParticipants.length % 2 != 1)
			throw new UsageError("昇格させる参加者は奇数人でなければなりません");
		const target = pendingParticipants[Math.floor(Math.random() * pendingParticipants.length)];
		target.become(new ParticipantState('battled'));
	}

	public setChampion() {
		if (this.canSetChampion() == false)
			throw new UsageError("チャンピオンを決定できません");
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		const champion = battledParticipants[0];
		if (!champion)
			throw new UsageError("バトル済みの参加者が1人ではありません");
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
			return false;
		if (this._props.participants.length < 2)
			return false;
		if (this.isOverRound() == false)
			return false;
		const battledParticipants = this.getParticipantsByState(new ParticipantState('battled'));
		if (battledParticipants.length !== 1)
		{
			console.log("バトル済みの参加者が1人ではありません");
			return false;
		}
		return true;
	}

	public canModifyTournament() {
		return this._props.state.equals(new TournamentState("reception"));
	}

	private changeParticipantState(participant: Participant, state: ParticipantState) {
		const target = this.getParticipant(participant);
		if (!target)
			throw new UsageError("トーナメントに属していない参加者です");
		if (this._props.state.equals(new TournamentState('open')) == false)
			throw new UsageError("開催中のトーナメントでのみ変更可能です")
		target.become(state);
	}

	/** ゲッター */
	public getParticipant(participant: Participant) {
		return this.getParticipantById(participant.id);
	}

	public getParticipantById(id: ParticipantId) {
		return this._props.participants.find((p) => p.id.equals(id));
	}

	public getParticipantByExternalId(externalId: string) {
		return this._props.participants.find((p) => p.externalId === externalId);
	}

	public getParticipantsByState(state: ParticipantState) {
		return this._props.participants.filter((p) => p.state.equals(state));
	}

	public getOwner() {
		const owner = this.getParticipantById(this._props.ownerId);
		if (!owner)
			throw new InternalError("存在するはずのオーナーが存在しません");
		return owner;
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

	get max_num() {
		return this._props.max_num;
	}

	get state() {
		return this._props.state;
	}

	get rule() {
		return this._props.rule;
	}

	get participants() {
		return this._props.participants;
	}

	get histories() {
		return this._props.histories;
	}
}
