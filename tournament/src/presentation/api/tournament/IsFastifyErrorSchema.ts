import { FastifyError } from "fastify";


export class IsFastifyErrorSchema {

	static isTrue(input: unknown): input is FastifyError {
		console.log(input);
		if (input == null || input == undefined)
			return false;
		if (typeof input != 'object')
			return false;
		if ('code' in input == false)
			return false;
		if ('statusCode' in input == false)
			return false;
		if ('error' in input == false)
			return false;
		if ('message' in input == false)
			return false;
		return true;
	}
}
