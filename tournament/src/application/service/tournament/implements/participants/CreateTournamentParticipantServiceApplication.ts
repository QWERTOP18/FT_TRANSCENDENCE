import { IRepositoryFactory } from "../../../../../domain/interfaces/IRepositoryFactory";
import { Participant } from "../../../../../domain/tournament/entities/Participant";
import { NotFoundError } from "../../../../../domain/tournament/TournamentError";
import { TournamentId } from "../../../../../domain/tournament/value-objects/TournamentId";
import { ParticipantDTO } from "../../../../dto/ParticipantDTO";


export type CreateTournamentParticipantServiceApplicationCommand = {
	tournament_id: string;
	external_id: string,
	name: string;
};

export class CreateTournamentParticipantServiceApplication {
	constructor(private readonly repositoryFactory: IRepositoryFactory) { }

	async execute(command: CreateTournamentParticipantServiceApplicationCommand) {
		return this.repositoryFactory.transaction(async (repository) => {
			const participant = this.createParticipantFromCommand(command);
			const tournament = await repository.find(participant.tournamentId);
			if (tournament == null)
				throw new NotFoundError("トーナメントが見つかりませんでした。");
			tournament.addParticipant(participant);
			await repository.update(tournament);
			return ParticipantDTO.fromDomain(participant);
		});
	}

	createParticipantFromCommand(command: CreateTournamentParticipantServiceApplicationCommand) {
		const tournamentId = new TournamentId(command.tournament_id);
		const participant = Participant.create(tournamentId, command.external_id, command.name);
		return participant;
	}
}
