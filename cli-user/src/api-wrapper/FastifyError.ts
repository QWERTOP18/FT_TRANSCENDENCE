
export interface FastifyErrorSchema {
  code: string;
  statusCode: number;
  error: string;
  message: string;
}

export class FastifyError extends Error {
	code: string;
	statusCode: number;
	error: string;
	endpoint?: string;

	constructor(json: FastifyErrorSchema, endpoint?: string) {
		super(json.message);
		this.code = json.code;
		this.statusCode = json.statusCode;
		this.error = json.error;
		this.name = 'AuthError';
		this.endpoint = endpoint;
	}

	valueOf(): FastifyErrorSchema & { endpoint?: string } {
		return {
			code: this.code,
			statusCode: this.statusCode,
			error: this.error,
			message: this.message,
			endpoint: this.endpoint,
		};
	}
}
