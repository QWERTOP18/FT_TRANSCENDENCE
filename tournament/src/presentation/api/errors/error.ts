export class TournamentError {
	constructor(
		public code: string,
		public message: string,
		public statusCode: number,
		public name: string,
	) { }
}

function createError(code: string, message: string, statusCode: number = 500) {
	return class extends TournamentError {
		constructor() {
			super(code, message, statusCode, 'TournamentError');
		}
	}
}

export const NotImplementedError = createError('TRT_ERR_NOT_IMPLEMENTED', 'この機能は実装されていません', 500)
export const NotFoundError = createError('TRT_ERROR_NOT_FOUND', '見つかりませんでした。', 404);
export const SomeError = createError('TRT_ERROR_SOME_WRONG', '何かしらの問題が発生しました。', 400)
