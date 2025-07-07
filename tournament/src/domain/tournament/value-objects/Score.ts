import { ValueObject } from "./ValueObject";

export class Score extends ValueObject<'Score', number> {
	constructor(value: number) {
		super('Score', value);
	}

	protected validate(value: number): void {
		if (value < 0)
			throw new Error('スコアの値が不正です')
	}
}
