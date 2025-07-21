import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { TournamentDomainService } from "../../../../../domain/services/Tournament/TournamentDomainService";
import { Tournament } from "../../../../../domain/tournament/aggregate/Tournament";
import { InternalError } from "../../../../../domain/tournament/TournamentError";
import { TournamentDTO } from "../../../../dto/TournamentDTO";


export type CreateTournamentApplicationServiceCommand = {
	readonly name?: string;
	readonly description?: string;
	readonly max_num: number;
	readonly ownerExternalId: string;
	readonly ownerName: string;
}

export class CreateTournamentApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CreateTournamentApplicationServiceCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const tournament = Tournament.create({
				name: command.name,
				description: command.description,
				max_num: command.max_num,
				ownerExternalId: command.ownerExternalId,
				ownerName: command.ownerName,
			});
			const domainService = new TournamentDomainService(repository);
			const isDuplicated = await domainService.checkDuplicatedTournamentId(tournament.id);
			if (isDuplicated)
				throw new InternalError(`Tournament with ID ${tournament.id.value} already exists.`);
			await repository.create(tournament);
			return TournamentDTO.fromDomain(tournament);
		});
	}
}
