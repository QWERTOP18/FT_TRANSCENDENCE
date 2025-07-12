import { ParticipantId } from "./ParticipantId";
import { Score } from "./Score";
import { ValueObject } from "./ValueObject";

type ParticipantScoreValue = {
	id: ParticipantId,
	score: Score,
}

export class ParticipantScore extends ValueObject<'ParticipantScore', ParticipantScoreValue> {
	constructor(value: ParticipantScoreValue) {
		super('ParticipantScore', value);
	}

	protected validate(value: ParticipantScoreValue): void {
	}

	/** ゲッター */
	get id() {
		return this.value.id;
	}

	get score() {
		return this.value.score;
	}

}
