import { describe, test, expect } from 'vitest';
import { TournamentId } from '../value-objects/TournamentId';
import { TournamentRule } from '../value-objects/TournamentRule';
import { Participant, ParticipantValue } from '../entities/Participant';
import { Tournament, TournamentValue } from './Tournament';
import { ParticipantId } from '../value-objects/ParticipantId';
import { ParticipantState } from '../value-objects/ParticipantState';
import { TournamentState } from '../value-objects/TournamentState';

describe("Tournament", () => {
	openTest();
	addParticipantTest();
})

function openTest() {
	const tournamentId = new TournamentId();
	const genParticipantBaseContext = (): Pick<ParticipantValue, 'tournamentId' | 'state'> => ({
		tournamentId: tournamentId,
		state: new ParticipantState('pending')		
	})
	const participants = {
		Owner: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("67f65aef-6d10-4319-aaaa-e2ea1a01411e"),
			externalId: "owner123",
			name: "Owner Name",}),
		A: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("c427e824-a97b-410c-9f62-f764d736f3ff"),
			externalId: "participantA",
			name: "Alice",}),
		B: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("2777e449-4375-4522-a58b-4268cee7ba12"),
			externalId: "participantB",
			name: "Bob",}),
		C: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("7290fef8-c96e-4de0-a492-69e1d8c77555"),
			externalId: "participantC",
			name: "Charlie",}),
	}
	const genTournamentBaseContext = (): Omit<TournamentValue, 'state'> => ({
		id: tournamentId,
		championId: undefined,
		name: "Test Tournament",
		description: "This is a test tournament",
		rule: new TournamentRule('point5'),
		max_num: 8,
		ownerId: participants.Owner.id,
		participants: [participants.Owner],
		histories: [],
	});

	describe("open", () => {
		describe("正常系", () => {
			test("参加者が二人以上ならトーナメントを開けること", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				tournament.addParticipant(participants.A);
				expect(() => tournament.open()).not.toThrowError();
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();
			});
		})

		describe("異常系", () => {
			test("参加者が一人ならトーナメントを開けないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
					participants: [participants.Owner],
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('reception'))).toBeTruthy();
			});
	
			test("open済みなら開けないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('open'),
					participants: [participants.Owner, participants.A],
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();
			});
	
			test("close済みなら開けないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('close'),
					participants: [participants.Owner, participants.A],
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('close'))).toBeTruthy();
			});
		});
	})
}

// 参加者追加のテスト
function addParticipantTest() {
	const tournamentId = new TournamentId();
	const genParticipantBaseContext = (): Pick<ParticipantValue, 'tournamentId'> => ({
		tournamentId: tournamentId,
	})
	const participants = {
		Owner: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("67f65aef-6d10-4319-aaaa-e2ea1a01411e"),
			state: new ParticipantState("pending"),
			externalId: "owner123",
			name: "Owner Name",}),
		A: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("c427e824-a97b-410c-9f62-f764d736f3ff"),
			state: new ParticipantState("pending"),
			externalId: "participantA",
			name: "Alice",}),
		B: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("2777e449-4375-4522-a58b-4268cee7ba12"),
			state: new ParticipantState("pending"),
			externalId: "participantB",
			name: "Bob",}),
		C: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("7290fef8-c96e-4de0-a492-69e1d8c77555"),
			state: new ParticipantState("pending"),
			externalId: "participantC",
			name: "Charlie",}),
		// external_idは重複しているが、IDは異なる
		C_DupExternalId: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("6c52ce10-8582-4ba3-91cb-b84a4335bc48"),
			state: new ParticipantState("pending"),
			externalId: "participantC",
			name: "Charlie",}),
		// IDが重複しているが、外部IDは異なる
		C_DupId: Participant.reconstruct({
			...genParticipantBaseContext(),
			id: new ParticipantId("7290fef8-c96e-4de0-a492-69e1d8c77555"),
			state: new ParticipantState("pending"),
			externalId: "not_same C",
			name: "Charlie",}),
		
	}
	const genTournamentBaseContext = (): Omit<TournamentValue, 'state'> => ({
		id: tournamentId,
		championId: undefined,
		name: "Test Tournament",
		description: "This is a test tournament",
		rule: new TournamentRule('point5'),
		max_num: 2,
		ownerId: participants.Owner.id,
		participants: [participants.Owner],
		histories: [],
	});

	describe("addParticipant", () => {
		describe("正常系", () => {
			test("参加者を追加できること", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.addParticipant(participants.A)).not.toThrowError();
			});
		})
		describe("異常系", () => {
			test("最大数が追加されている時追加できないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				tournament.addParticipant(participants.A);
				expect(() => tournament.addParticipant(participants.B)).toThrowError();
			});

			test("同じIDの参加者を追加できないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				tournament.addParticipant(participants.C);
				expect(() => tournament.addParticipant(participants.C_DupId)).toThrowError();
			})

			test("同じexternal_idの参加者を追加できないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('reception'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				tournament.addParticipant(participants.C);
				expect(() => tournament.addParticipant(participants.C_DupExternalId)).toThrowError();
			})

			test("open済みなら追加できないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('open'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.addParticipant(participants.A)).toThrowError();
			})

			test("close済みなら追加できないこと", () => {
				const tournamentContext: TournamentValue = {
					...genTournamentBaseContext(),
					state: new TournamentState('close'),
				}
				const tournament = Tournament.reconstruct(tournamentContext);
				expect(() => tournament.addParticipant(participants.A)).toThrowError();
			})
		})
	})
}

function readyTest() {

}

function cancelTest() {

}

function startBattleTest() {}

function endBattleTest() {}
