import { describe, expect, test } from 'vitest';
import { ParticipantScore } from './ParticipantScore';
import { ParticipantId } from './ParticipantId';
import { Score } from './Score';

describe("ParticipantScore", () => {

	test("正常な参加者スコアの生成", () => {
		const participantId = new ParticipantId();
		const score = new Score(100);
		const participantScore = new ParticipantScore({
			id: participantId,
			score: score
		});

		expect(participantScore.id).toBe(participantId);
		expect(participantScore.score).toBe(score);
		expect(participantScore.type).toBe('ParticipantScore');
	});

	test("ゼロスコアの参加者", () => {
		const participantId = new ParticipantId();
		const score = new Score(0);
		const participantScore = new ParticipantScore({
			id: participantId,
			score: score
		});

		expect(participantScore.id).toBe(participantId);
		expect(participantScore.score).toBe(score);
		expect(participantScore.score.value).toBe(0);
	});

	test("既存IDでの参加者スコア生成", () => {
		const existingId = '123e4567-e89b-12d3-a456-426614174000';
		const participantId = new ParticipantId(existingId);
		const score = new Score(250);
		const participantScore = new ParticipantScore({
			id: participantId,
			score: score
		});

		expect(participantScore.id.value).toBe(existingId);
		expect(participantScore.score.value).toBe(250);
	});
})
