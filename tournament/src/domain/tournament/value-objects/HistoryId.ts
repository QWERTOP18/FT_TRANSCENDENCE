import { UUID } from './UUID';

export class HistoryId extends UUID<'HistoryId'> {
	constructor(value: string) {
		super('HistoryId', value);
	}
}
