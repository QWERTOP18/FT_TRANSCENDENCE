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
	readyTest();
})

// トーナメントを開くテスト
function openTest() {
	describe("open", () => {
		describe("正常系", () => {
			test("参加者が二人以上ならトーナメントを開催できること", () => {
				const tournament = genTournament()
				tournament.addParticipant(genParticipant('A'));
				expect(() => tournament.open()).not.toThrowError();
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();
			});
		})

		describe("異常系", () => {
			test("参加者が一人ならトーナメントを開けないこと", () => {
				const tournament = genTournament()
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('reception'))).toBeTruthy();
			});

			test("open済みなら開けないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						genParticipant('Owner'),
						genParticipant('A')
					],
				})
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();
			});

			test("close済みなら開けないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('close'),
					participants: [
						genParticipant('Owner'),
						genParticipant('A')
					],
				})
				expect(() => tournament.open()).toThrowError();
				expect(tournament.state.equals(new TournamentState('close'))).toBeTruthy();
			});
		});
	})
}

// 参加者追加のテスト
function addParticipantTest() {
	describe("addParticipant", () => {
		describe("正常系", () => {
			test("参加者を追加できること", () => {
				const tournament = genTournament({
					state: new TournamentState('reception'),
				})
				expect(() => tournament.addParticipant(genParticipant('A'))).not.toThrowError();
			});
		})
		describe("異常系", () => {
			test("最大数が追加されている時追加できないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('reception'),
				})
				tournament.addParticipant(genParticipant('A'));
				expect(() => tournament.addParticipant(genParticipant('B'))).toThrowError();
			});

			test("同じIDの参加者を追加できないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('reception'),
				})
				tournament.addParticipant(genParticipant('C'));
				expect(() => tournament.addParticipant(genParticipant('C_DupId'))).toThrowError();
			})

			test("同じexternal_idの参加者を追加できないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('reception'),
				})
				tournament.addParticipant(genParticipant('C'));
				expect(() => tournament.addParticipant(genParticipant('C_DupExternalId'))).toThrowError();
			})

			test("open済みなら追加できないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('open')
				})
				expect(() => tournament.addParticipant(genParticipant('A'))).toThrowError();
			})

			test("close済みなら追加できないこと", () => {
				const tournament = genTournament({
					state: new TournamentState('close')
				})
				expect(() => tournament.addParticipant(genParticipant('A'))).toThrowError();
			})
		})
	})
}

// 参加者を準備完了にするテスト
function readyTest() {
	describe("ready", () => {
		describe("正常系", () => {
			test("参加者を準備完了 ( ready ) にできること", () => {
				const participantA = genParticipant('A'); // A
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				});
				expect(() => tournament.ready(participantA)).not.toThrowError();
				expect(participantA.state.equals(new ParticipantState('ready'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('pending'))).toBeTruthy();
			});
		})

		describe("異常系", () => {
			for (const state of ['reception', 'close'] as const) {
				test(`トーナメントが "${state}" 状態だと準備完了にできないこと`, () => {
					const participantA = genParticipant('A'); // A
					const participantOwner = genParticipant('Owner'); // Owner
					const tournament = genTournament({
						state: new TournamentState(state),
						participants: [
							participantOwner,
							participantA,
						]
					});
					expect(() => tournament.ready(participantA)).toThrowError();
				});
			}

			test("トーナメントに属していない参加者は準備完了にできないこと", () => {
				const participantA = genParticipant('A'); // A
				const participantOwner = genParticipant('Owner'); // Owner
				const participantC = genParticipant('C'); // C
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				});
				expect(() => tournament.ready(participantC)).toThrowError();
			});

			for (const state of ['ready', 'in_progress', 'battled', 'eliminated', 'champion'] as const)
			{
				test(`参加者が "${state}" のときはreadyにできないこと`, () => {
					const participantOwner = genParticipant('Owner'); // Owner
					const participantA = genParticipant('A', {
						state: new ParticipantState(state)
					}) // A
					const tournament = genTournament({
						state: new TournamentState('open'),
						participants: [
							participantOwner,
							participantA,
						]
					});
					expect(() => tournament.ready(participantA)).toThrowError();
				});
			}
		})
	});
}

// キャンセルのテスト
function cancelTest() {

}

// バトル開始のテスト
function startBattleTest() { }

// バトル終了のテスト
function endBattleTest() { }

/**
 * Utils
 */
const tournamentId = new TournamentId('10e7e082-64fd-4e05-9222-704d1b6311d2');

function genParticipantBaseContext(): Pick<ParticipantValue, 'tournamentId' | 'state'> {
	return {
		tournamentId: tournamentId,
		state: new ParticipantState("pending"),
	}
}

function genParticipant(name: 'Owner' | 'A' | 'B' | 'C' | 'C_DupExternalId' | 'C_DupId', options: Partial<ParticipantValue> = {}): Participant {
	const participant_values: Record<typeof name, ParticipantValue> = {
		Owner: {
			...genParticipantBaseContext(),
			tournamentId: tournamentId,
			id: new ParticipantId("67f65aef-6d10-4319-aaaa-e2ea1a01411e"),
			externalId: "owner123",
			name: "Owner Name",
		},
		A: {
			...genParticipantBaseContext(),
			id: new ParticipantId("c427e824-a97b-410c-9f62-f764d736f3ff"),
			externalId: "participantA",
			name: "Alice",
		},
		B: {
			...genParticipantBaseContext(),
			id: new ParticipantId("2777e449-4375-4522-a58b-4268cee7ba12"),
			externalId: "participantB",
			name: "Bob",
		},
		C: {
			...genParticipantBaseContext(),
			id: new ParticipantId("7290fef8-c96e-4de0-a492-69e1d8c77555"),
			externalId: "participantC",
			name: "Charlie",
		},
		// external_idは重複しているが、IDは異なる
		C_DupExternalId: {
			...genParticipantBaseContext(),
			id: new ParticipantId("6c52ce10-8582-4ba3-91cb-b84a4335bc48"),
			externalId: "participantC",
			name: "Charlie",
		},
		// IDが重複しているが、外部IDは異なる
		C_DupId: {
			...genParticipantBaseContext(),
			id: new ParticipantId("7290fef8-c96e-4de0-a492-69e1d8c77555"),
			externalId: "not_same C",
			name: "Charlie",
		},
	};
	const participant = Participant.reconstruct({
		...participant_values[name],
		...options
	})
	return participant;
}

function genTournament(options: Partial<TournamentValue> = {}): Tournament {
	return Tournament.reconstruct({
		id: tournamentId,
		championId: undefined,
		name: "Test Tournament",
		description: "This is a test tournament",
		rule: new TournamentRule('point5'),
		max_num: 2,
		ownerId: genParticipant('Owner').id,
		state: new TournamentState('reception'),
		participants: [
			genParticipant('Owner')
		],
		histories: [],
		...options
	});
}
