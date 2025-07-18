import { describe, expect, test } from 'vitest';
import { ParticipantId } from './ParticipantId';
import { uuidRegex } from './UUID';

describe("ParticipantId", () => {

	test("新しい参加者IDの生成", () => {
		const participantId = new ParticipantId();
		expect(participantId.value).toMatch(uuidRegex);
		expect(participantId.type).toBe('ParticipantId');
	})

	test("既存の参加者IDの生成", () => {
		const existingId = '123e4567-e89b-12d3-a456-426614174000';
		const participantId = new ParticipantId(existingId);
		expect(participantId.value).toBe(existingId);
		expect(participantId.equals(new ParticipantId(participantId.value))).toBeTruthy();
		expect(participantId.type).toBe('ParticipantId');
	});

	test("無効なUUIDの検証", () => {
		expect(() => new ParticipantId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toThrowError();
	});

})
