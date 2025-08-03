import { BattleAPI } from "../api-wrapper/battle/BattleAPI";
import { BattleError } from "../api-wrapper/battle/BattleError";
import { TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";
import { LoginSessionService } from "../services/LoginSessionService";
import { ParticipantsService } from "../services/ParticipantsService";


export class ReadyService {
	async readyForTournament(tournamentId: string) {
		console.log('Ready to play tournament!');
		const user = LoginSessionService.getCurrentUser();
		try {
			const api = new TournamentAPI();
			const participants = await api.getTournamentParticipants(tournamentId, user.id);
			const isJoined = await new ParticipantsService().alreadyJoinedTournament(participants, user.id);
			if (isJoined == false) {
				console.log('You are not a participant in this tournament. Please join first.');
				return;
			}
			const battleService = new BattleAPI();
			await battleService.ready(tournamentId, user.id);
			console.log('Ready signal sent successfully!');
			return;
		} catch (error) {
			if (error instanceof BattleError) {
				console.error('Can not ready: ', error.error);
				return;
			}
			throw error;
		}
	}
}
