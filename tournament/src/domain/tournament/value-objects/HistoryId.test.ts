import { describe, expect, test } from 'vitest';
import { HistoryId } from './HistoryId';
import { uuidRegex } from './UUID';

describe("HistoryId", () => {

	test("新しい履歴IDの生成", () => {
		const historyId = new HistoryId();
		expect(historyId.value).toMatch(uuidRegex);
		expect(historyId.type).toBe('HistoryId');
	})

	test("既存の履歴IDの生成", () => {
		const existingId = '123e4567-e89b-12d3-a456-426614174000';
		const historyId = new HistoryId(existingId);
		expect(historyId.value).toBe(existingId);
		expect(historyId.equals(new HistoryId(historyId.value))).toBeTruthy();
		expect(historyId.type).toBe('HistoryId');
	});

	test("無効なUUIDの検証", () => {
		expect(() => new HistoryId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toThrowError();
	});

})
