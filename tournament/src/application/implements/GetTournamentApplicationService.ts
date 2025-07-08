import { IRepositoryFactory } from "../../domain/interfaces/IRepositoryFactory";
import { TournamentId } from "../../domain/tournament/value-objects/TournamentId";
import { TournamentDTO } from "../dto/TournamentDTO";

export type GetTournamentApplicationServiceCommand = {
	readonly tournamentId: string;
}

export class GetTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: GetTournamentApplicationServiceCommand) {
		return this.repositoryFactory.run(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const tournament = await repository.find(tournamentId);
			return tournament && TournamentDTO.fromDomain(tournament);
		});
	}
}
