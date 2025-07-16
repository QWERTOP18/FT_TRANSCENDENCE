import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { HistoryDTO } from "../../../../dto/HistoryDTO";

export type GetTournamentHistoriesApplicationServiceCommand = {
	readonly tournamentId: string;
}

export class GetTournamentHistoriesApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: GetTournamentHistoriesApplicationServiceCommand) {
		return this.repositoryFactory.run(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				return null;
			return tournament && tournament.histories.map(h => HistoryDTO.fromDomain(h));
		});
	}
}
