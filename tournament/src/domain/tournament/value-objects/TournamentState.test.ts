import { describe, expect, test } from 'vitest';
import { TournamentState, TournamentStateValue } from './TournamentState';

describe("TournamentState", () => {

	test("有効な状態での生成", () => {
		const validStates: TournamentStateValue[] = ['reception', 'open', 'close'];

		validStates.forEach(state => {
			const tournamentState = new TournamentState(state);
			expect(tournamentState.value).toBe(state);
			expect(tournamentState.equals(new TournamentState(state))).toBeTruthy();
			expect(tournamentState.type).toBe('TournamentState');
		});
	});

})
