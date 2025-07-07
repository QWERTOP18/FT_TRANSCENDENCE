
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

export const TournamentStateError = createTournamentError("TRT_ERR_INVALID_TOURNAMENT_STATE");
export const InvalidIdError = createTournamentError("TRT_ERR_INVALID_ID");
export const NoRelationalError = createTournamentError("TRT_NO_RELATIONAL_TOURNAMENT");
export const BadStateError = createTournamentError("TRT_BAD_STATE")
export const DuplicatedError = createTournamentError("TRT_DUPLICATED")
