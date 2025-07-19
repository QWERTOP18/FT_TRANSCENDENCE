import { describe, expect, test } from 'vitest';
import { ParticipantState, ParticipantStateValue } from './ParticipantState';

describe("ParticipantState", () => {

	test("有効な状態での生成", () => {
		const validStates: ParticipantStateValue[] = [
			'pending', 'ready', 'in_progress', 'battled', 'eliminated', 'champion'
		];

		validStates.forEach(state => {
			const participantState = new ParticipantState(state);
			expect(participantState.value).toBe(state);
			expect(participantState.equals(new ParticipantState(state))).toBeTruthy();
			expect(participantState.type).toBe('ParticipantState');
		});
	});

	test("無効な状態でエラーが発生", () => {
		// @ts-ignore - テストのため型チェックを無視
		expect(() => new ParticipantState('invalid_state')).toThrowError('参加者のstateの形式が不正です');
		// @ts-ignore - テストのため型チェックを無視
		expect(() => new ParticipantState('unknown')).toThrowError('参加者のstateの形式が不正です');
	});
})
