import { IRepositoryFactory } from "../../domain/interfaces/IRepositoryFactory";
import { TournamentDomainService } from "../../domain/services/Tournament/TournamentDomainService";
import { Tournament } from "../../domain/tournament/aggregate/Tournament";
import { DuplicatedError } from "../../domain/tournament/TournamentError";


export type CreateTournamentApplicationServiceCommand = {
	readonly name?: string;
	readonly description?: string;
	readonly ownerExternalId: string;
}

export class CreateTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CreateTournamentApplicationServiceCommand): Promise<void> {
		await this.repositoryFactory.transaction(async (repository) => {
			const tournament = Tournament.create({
				name: command.name,
				description: command.description,
				ownerExternalId: command.ownerExternalId
			});
			const domainService = new TournamentDomainService(repository);
			const isDuplicated = await domainService.checkDuplicatedTournamentId(tournament.id);
			if (isDuplicated)
				throw new DuplicatedError(`Tournament with ID ${tournament.id.value} already exists.`);
			return await repository.create(tournament);
		});
	}
}
