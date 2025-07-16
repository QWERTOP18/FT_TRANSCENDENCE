import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { NotFoundError } from "../../../../../domain/tournament/TournamentError";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";

export type OpenTournamentApplicationServiceCommand = {
	readonly tournamentId: string;
}

export class OpenTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: OpenTournamentApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			tournament.open();
			await repository.update(tournament);
		});
	}
}
