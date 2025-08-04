import { TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";
import { TournamentError } from "../api-wrapper/tournament/TournamentError";
import { LoginSessionService } from "../services/LoginSessionService";
import { ParticipantsService } from "../services/ParticipantsService";



export class JoinTournamentService {
	async joinTournament(tournamentId: string) {
		const user = LoginSessionService.getCurrentUser();
		try {
			console.log('\nJoining tournament...');
			const participants = await new TournamentAPI().getTournamentParticipants(tournamentId, user.id);
			const participantsService = new ParticipantsService();
			if (await participantsService.alreadyJoinedTournament(participants, user.id)) {
				console.log('You are already a participant in this tournament.');
				return;
			}
			const tournamentAPI = new TournamentAPI();
			await tournamentAPI.joinTournament(tournamentId, user.id);
			console.log('Successfully joined the tournament!');
		} catch (error) {
			if (error instanceof TournamentError) {
				console.error('Error joining tournament:', error.message);
				return;
			}
			throw error;
		}
	}
}
