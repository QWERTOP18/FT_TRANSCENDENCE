import { describe, expect, test } from 'vitest';
import { HistoryId } from './HistoryId';

describe("HistoryId", () => {

	test("新しい履歴IDの生成", () => {
		const historyId = new HistoryId();
		expect(historyId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[)1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		expect(historyId.toString()).toBe(historyId.value);
		expect(historyId.type).toBe('HistoryId');
	})

	test("既存の履歴IDの生成", () => {
		const existingId = '123e4567-e89b-12d3-a456-426614174000';
		const historyId = new HistoryId(existingId);
		expect(historyId.value).toBe(existingId);
		expect(historyId.toString()).toBe(existingId);
		expect(historyId.type).toBe('HistoryId');
	});

	test("無効なUUIDの検証", () => {
		expect(() => new HistoryId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toThrowError();
	});

	test("snap shotテスト", () => {
		const data = { foo: new Set(['bar', 'snapshot']) }
		expect(data).toMatchSnapshot()
	});
})
