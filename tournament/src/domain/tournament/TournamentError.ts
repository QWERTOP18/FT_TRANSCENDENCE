
class TournamentError extends Error {
	constructor(public errorCode: string, public message: string) { super(message) }
}

const createTournamentError = (errorCode: string) => {
	return class extends TournamentError {
		constructor(public message: string) {
			super(errorCode, message);
		}
	}
}

export const UsageError = createTournamentError("TRT_ERR_USAGE");
export const RepositoryError = createTournamentError("TRT_ERR_REPOSITORY");
export const InternalError = createTournamentError("TRT_ERR_INTERNAL")
export const NotFoundError = createTournamentError("TRT_ERR_NOTFOUND");
export const PermissionError = createTournamentError("TRT_ERR_PERMISSION");
