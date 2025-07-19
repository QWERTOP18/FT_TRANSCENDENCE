import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { TournamentDTO } from "../../../../dto/TournamentDTO";

export type GetAllTournamentApplicationServiceCommand = {
}

export class GetAllTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: GetAllTournamentApplicationServiceCommand) {
		return this.repositoryFactory.run(async (repository) => {
			const tournaments = await repository.findAll();
			return tournaments.map((tournament) => TournamentDTO.fromDomain(tournament));
		});
	}
}
