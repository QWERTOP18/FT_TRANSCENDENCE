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
		// 正常系
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

		// 異常系
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
	})
}

function addParticipantTest() {

}

function readyTest() {

}

function cancelTest() {

}

function startBattleTest() {}

function endBattleTest() {}
