import { describe, test, expect } from 'vitest';
import { TournamentId } from '../value-objects/TournamentId';
import { TournamentRule } from '../value-objects/TournamentRule';
import { Participant, ParticipantValue } from '../entities/Participant';
import { Tournament, TournamentValue } from './Tournament';
import { ParticipantId } from '../value-objects/ParticipantId';
import { ParticipantState } from '../value-objects/ParticipantState';
import { TournamentState } from '../value-objects/TournamentState';
import { History, HistoryValue } from '../entities/History';
import { HistoryId } from '../value-objects/HistoryId';
import { ParticipantScore } from '../value-objects/ParticipantScore';
import { Score } from '../value-objects/Score';

describe("Tournament", () => {
	openTest();
	addParticipantTest();
	readyTest();
	cancelTest();
	startBattleTest();
	endBattleTest();
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

			for (const state of ['ready', 'in_progress', 'battled', 'eliminated', 'champion'] as const) {
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
	describe("cancel", () => {
		describe("正常系", () => {
			test("ready状態の参加者をキャンセルできること", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('ready')
				}); // A
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				});
				expect(() => tournament.cancel(participantA)).not.toThrowError();
				expect(participantA.state.equals(new ParticipantState('pending'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('pending'))).toBeTruthy();
			})
		})

		describe("異常系", () => {
			for (const state of ['reception', 'close'] as const) {
				test(`トーナメントが "${state}" 状態だとキャンセルにできないこと`, () => {
					const participantA = genParticipant('A', {
						state: new ParticipantState('ready')
					}); // A
					const participantOwner = genParticipant('Owner'); // Owner
					const tournament = genTournament({
						state: new TournamentState(state),
						participants: [
							participantOwner,
							participantA,
						]
					});
					expect(() => tournament.cancel(participantA)).toThrowError();
				});
			}

			test("トーナメントに属していない参加者は準備完了にできないこと", () => {
				const participantA = genParticipant('A'); // A
				const participantOwner = genParticipant('Owner'); // Owner
				const participantC = genParticipant('C', {
					state: new ParticipantState('ready')
				}); // C
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				});
				expect(() => tournament.cancel(participantC)).toThrowError();
			});

			for (const state of ['pending', 'eliminated', 'champion'] as const) {
				test(`参加者が "${state}" のときはpendingにできないこと`, () => {
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
					expect(() => tournament.cancel(participantA)).toThrowError();
				});
			}
		})
	})
}

// バトル開始のテスト
function startBattleTest() {
	describe("startBattle", () => {
		describe("正常系", () => {
			test("参加者をバトル開始状態 ( in_progress ) にできること", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('ready')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('ready')
				});
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
					]
				})
				expect(() => tournament.startBattle(participantA, participantB)).not.toThrowError();
				expect(participantA.state.equals(new ParticipantState('in_progress'))).toBeTruthy();
				expect(participantB.state.equals(new ParticipantState('in_progress'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('pending'))).toBeTruthy();
			});
		});
		describe("異常系", () => {
			for (const state of ['reception', 'close'] as const) {
				test(`トーナメントが "${state}" 状態だとバトル開始できないこと`, () => {
					const participantA = genParticipant('A', {
						state: new ParticipantState('ready')
					});
					const participantB = genParticipant('B', {
						state: new ParticipantState('ready')
					});
					const participantOwner = genParticipant('Owner'); // Owner
					const tournament = genTournament({
						state: new TournamentState(state),
						participants: [
							participantOwner,
							participantA,
							participantB,
						]
					})
					expect(() => tournament.startBattle(participantA, participantB)).toThrowError();
				});
			}

			test("トーナメントに属していない参加者はバトル開始できないこと", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('ready')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('ready')
				});
				const participantC = genParticipant('C', {
					state: new ParticipantState('ready')
				});
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
					]
				})
				expect(() => tournament.startBattle(participantC, participantB)).toThrowError();
			});

			test("同じ参加者を指定するとバトル開始できないこと", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('ready')
				});
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				})
				expect(() => tournament.startBattle(participantA, participantA)).toThrowError();
			});

			describe("ready同士以外はバトルできないこと", () => {
				const states = ['pending', 'ready', 'in_progress', 'battled', 'eliminated', 'champion'] as const;
				for (const stateA of states) {
					for (const stateB of states) {
						if (stateA == 'ready' && stateB == 'ready')
							continue; // ready同士は許容
						test(`A="${stateA}", B="${stateB}" のとき`, () => {
							const participantA = genParticipant('A', {
								state: new ParticipantState(stateA)
							});
							const participantB = genParticipant('B', {
								state: new ParticipantState(stateB)
							});
							const participantOwner = genParticipant('Owner'); // Owner
							const tournament = genTournament({
								state: new TournamentState('open'),
								participants: [
									participantOwner,
									participantA,
									participantB,
								]
							})
							expect(() => tournament.startBattle(participantA, participantB)).toThrowError();
						});
					}
				}
			})
		});
	});
}

// バトル終了のテスト
function endBattleTest() {
	describe("endBattle", () => {
		describe("正常系", () => {
			test("バトルを終了できること", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('in_progress')
				});
				const participantC = genParticipant('C');
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
						participantC,
					]
				})
				const winner = participantA;
				const loser = participantB;
				const history = genHistory(winner, loser);
				expect(() => tournament.endBattle(history)).not.toThrowError();
				expect(winner.state.equals(new ParticipantState('battled'))).toBeTruthy();
				expect(loser.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(participantC.state.equals(new ParticipantState('pending'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('pending'))).toBeTruthy();
			});

			test("バトル終了時に一人だけ勝ち残っているときは優勝になること(4人)", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('in_progress')
				});
				const participantC = genParticipant('C', {
					state: new ParticipantState('eliminated')
				});
				const participantOwner = genParticipant('Owner', {
					state: new ParticipantState('eliminated')
				}); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
						participantC,
					]
				})
				const winner = participantA;
				const loser = participantB;
				const history = genHistory(winner, loser);
				expect(() => tournament.endBattle(history)).not.toThrowError();
				expect(winner.state.equals(new ParticipantState('champion'))).toBeTruthy();
				expect(loser.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(participantC.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(tournament.championId?.equals(winner.id)).toEqual(true);
				expect(tournament.state.equals(new TournamentState('close'))).toBeTruthy();
			});

			test("ラウンドが終了したら勝ち残った人をpendingにする", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('in_progress')
				});
				const participantC = genParticipant('C', {
					state: new ParticipantState('battled')
				});
				const participantOwner = genParticipant('Owner', {
					state: new ParticipantState('eliminated')
				}); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
						participantC,
					]
				})
				const winner = participantA;
				const loser = participantB;
				const history = genHistory(winner, loser);
				expect(() => tournament.endBattle(history)).not.toThrowError();
				expect(winner.state.equals(new ParticipantState('pending'))).toBeTruthy();
				expect(loser.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(participantC.state.equals(new ParticipantState('pending'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(tournament.championId).toEqual(undefined);
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();
			});

			test("奇数人pendingになる場合は一人をbattledにする", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('in_progress')
				});
				const participantC = genParticipant('C', {
					state: new ParticipantState('battled')
				});
				const participantD = genParticipant('D', {
					state: new ParticipantState('battled')
				});
				const participantOwner = genParticipant('Owner', {
					state: new ParticipantState('eliminated')
				}); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
						participantB,
						participantC,
						participantD,
					]
				})
				const winner = participantA;
				const loser = participantB;
				const history = genHistory(winner, loser);
				expect(() => tournament.endBattle(history)).not.toThrowError();
				expect(loser.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(participantOwner.state.equals(new ParticipantState('eliminated'))).toBeTruthy();
				expect(tournament.championId).toEqual(undefined);
				expect(tournament.state.equals(new TournamentState('open'))).toBeTruthy();

				const battledParticipants = tournament.getParticipantsByState(new ParticipantState('battled'));
				const pendingParticipants = tournament.getParticipantsByState(new ParticipantState('pending'));
				expect(battledParticipants.length).toEqual(1);
				expect(pendingParticipants.length).toEqual(2);
			});
		});

		describe("異常系", () => {
			describe("バトル中でない参加者同士は終了できないこと", () => {
				const states = ['pending', 'ready', 'in_progress', 'battled', 'eliminated', 'champion'] as const;
				for (const stateA of states) {
					for (const stateB of states) {
						if (stateA == 'in_progress' && stateB == 'in_progress')
							continue; // in_progress同士は許容
						test(`A="${stateA}", B="${stateB}" のとき`, () => {
							const participantA = genParticipant('A', {
								state: new ParticipantState(stateA)
							});
							const participantB = genParticipant('B', {
								state: new ParticipantState(stateB)
							});
							const participantOwner = genParticipant('Owner'); // Owner
							const tournament = genTournament({
								state: new TournamentState('open'),
								participants: [
									participantOwner,
									participantA,
									participantB,
								]
							})
							const history = genHistory(participantA, participantB);
							expect(() => tournament.endBattle(history)).toThrowError();
						});
					}
				}
			});

			test("同じ参加者を指定するとバトル終了できないこと", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				})
				const history = genHistory(participantA, participantA);
				expect(() => tournament.endBattle(history)).toThrowError();
			});

			test("トーナメントに所属していない参加者を指定するとバトル終了できないこと", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantB = genParticipant('B', {
					state: new ParticipantState('in_progress')
				});
				const participantC = genParticipant('C', {
					state: new ParticipantState('in_progress')
				});
				const participantOwner = genParticipant('Owner'); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				})
				const history = genHistory(participantB, participantC);
				expect(() => tournament.endBattle(history)).toThrowError();
			});

			test("履歴のトーナメントIDが一致しない場合はバトル終了できないこと", () => {
				const participantA = genParticipant('A', {
					state: new ParticipantState('in_progress')
				});
				const participantOwner = genParticipant('Owner', {
					state: new ParticipantState('in_progress')
				}); // Owner
				const tournament = genTournament({
					state: new TournamentState('open'),
					participants: [
						participantOwner,
						participantA,
					]
				})
				const history = genHistory(participantA, participantOwner, {
					tournamentId: new TournamentId('00000000-0000-1000-8000-000000000000') // 不正なID
				});
				expect(() => tournament.endBattle(history)).toThrowError();
			});
		});
	});
}

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

function genParticipant(name: 'Owner' | 'A' | 'B' | 'C' | 'C_DupExternalId' | 'C_DupId' | 'D', options: Partial<ParticipantValue> = {}): Participant {
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
		D: {
			...genParticipantBaseContext(),
			id: new ParticipantId("2f108208-e2a9-4aec-ab28-8a450a08a7de"),
			externalId: "participantD",
			name: "David",
		}
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

function genHistory(winner: Participant, loser: Participant, options: Partial<HistoryValue> = {}): History {
	const historyId = new HistoryId('dde110d2-1d92-4b48-988f-c2815f00cdbb');
	const winnerScore = new ParticipantScore({
		id: winner.id,
		score: new Score(5),
	})
	const loserScore = new ParticipantScore({
		id: loser.id,
		score: new Score(1),
	})
	return History.reconstruct({
		id: historyId,
		tournamentId: tournamentId,
		winner: winnerScore,
		loser: loserScore,
		created_at: new Date(),
		...options,
	})
}
