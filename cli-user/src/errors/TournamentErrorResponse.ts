
export type TournamentErrorProperties = {
	error: string;
	message: string;
}

export class TournamentErrorResponse extends Error {

	error: string;
	
	constructor(properties: TournamentErrorProperties) {
		super(properties.message);
		this.name = 'TournamentErrorResponse';
		this.error = properties.error;
	}

	static isTournamentErrorProperties(obj: unknown): obj is TournamentErrorProperties {
		return (
			typeof obj === 'object' &&
			obj !== null &&
			'error' in obj &&
			'message' in obj &&
			typeof (obj as any).error === 'string' &&
			typeof (obj as any).message === 'string'
		);
	}
}
