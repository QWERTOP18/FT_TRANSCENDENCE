import { ITournamentRepository } from "../../interfaces/ITournamentRepository";
import { TournamentId } from "../../tournament/value-objects/TournamentId";

export class CheckDuplicatedTournamentIdService {
	constructor(private readonly tournamentRepository: ITournamentRepository) { }

	async execute(tournamentId: TournamentId): Promise<boolean> {
		const existingTournament = await this.tournamentRepository.find(tournamentId);
		return existingTournament !== null;
	}
}
