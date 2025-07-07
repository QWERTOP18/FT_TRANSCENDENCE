import { ValueObject } from './ValueObject';

export abstract class UUID<T> extends ValueObject<T, string> {
	protected validate(value: string): void {
		if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
			throw new Error(`Invalid UUID format: ${value}`);
		}
	}

	toString(): string {
		return this._value;
	}
}
