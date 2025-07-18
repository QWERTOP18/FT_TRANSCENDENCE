import { describe, expect, test } from 'vitest';
import { Score } from './Score';

describe("Score", () => {

	test("正常なスコアの生成", () => {
		const score = new Score(100);
		expect(score.value).toBe(100);
		expect(score.equals(new Score(100))).toBeTruthy();
		expect(score.type).toBe('Score');
	});

	test("ゼロのスコア", () => {
		const score = new Score(0);
		expect(score.value).toBe(0);
		expect(score.equals(new Score(0))).toBeTruthy();
		expect(score.type).toBe('Score');
	});

	test("負の値でエラーが発生", () => {
		expect(() => new Score(-1)).toThrowError('スコアの値が不正です');
		expect(() => new Score(-100)).toThrowError('スコアの値が不正です');
	});

	test("大きな値のスコア", () => {
		const score = new Score(999999);
		expect(score.value).toBe(999999);
		expect(score.equals(new Score(999999))).toBeTruthy();
		expect(score.type).toBe('Score');
	});
})
