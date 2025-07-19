import { describe, expect, test } from 'vitest';
import { TournamentId } from './TournamentId';
import { uuidRegex } from './UUID';

describe("TournamentId", () => {

	test("新しいトーナメントIDの生成", () => {
		const tournamentId = new TournamentId();
		expect(tournamentId.value).toMatch(uuidRegex);
		expect(tournamentId.type).toBe('TournamentId');
	})

	test("既存のトーナメントIDの生成", () => {
		const existingId = '123e4567-e89b-12d3-a456-426614174000';
		const tournamentId = new TournamentId(existingId);
		expect(tournamentId.value).toBe(existingId);
		expect(tournamentId.equals(new TournamentId(tournamentId.value))).toBeTruthy();
		expect(tournamentId.type).toBe('TournamentId');
	});

	test("無効なUUIDの検証", () => {
		expect(() => new TournamentId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toThrowError();
	});
})
