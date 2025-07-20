import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { ParticipantDTO } from "../../../../dto/ParticipantDTO";

export type GetTournamentParticipantsApplicationServiceCommand = {
	readonly tournamentId: string;
}

export class GetTournamentParticipantsApplicationService {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: GetTournamentParticipantsApplicationServiceCommand) {
		return this.repositoryFactory.run(async (repository) => {
			const tournamentId = new TournamentId(command.tournamentId);
			const tournament = await repository.find(tournamentId);
			if (tournament == null)
				return null;
			return tournament && tournament.participants.map(participant => ParticipantDTO.fromDomain(participant));
		});
	}
}
