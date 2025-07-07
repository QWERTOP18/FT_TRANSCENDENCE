import { isEqual } from 'lodash';

export abstract class ValueObject<T, V> {
	private _type: T;
	protected readonly _value: V;

	constructor(type: T, value: V) {
		this.validate(value);
		this._type = type;
		this._value = value;
	}

	protected abstract validate(value: V): void;

	get value(): V {
		return this._value;
	}

	get type(): T {
		return this._type;
	}

	equals(other: ValueObject<T, V>): boolean {
		return isEqual(this._value, other._value);
	}
}
