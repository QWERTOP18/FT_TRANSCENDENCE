
export class ErrorResponse extends Error {
	constructor(public error: string) {
		super(error);
		this.name = "ErrorResponse";
	}
}
