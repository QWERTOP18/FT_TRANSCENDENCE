import { BattleAPI } from "../api-wrapper/battle/BattleAPI";
import { BattleError } from "../api-wrapper/battle/BattleError";
import { TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";
import { WaitUntilCanBattle } from "../commands/WaitUntilCanBattle";
import { UsageError } from "../errors/UsageError";
import { GameService } from "../services/gameService";
import { LoginSessionService } from "../services/LoginSessionService";
import { ParticipantsService } from "../services/ParticipantsService";


export class ReadyService {
	async readyForTournament(tournamentId: string) {
		console.log('Ready to play tournament!');
		const user = LoginSessionService.getCurrentUser();
		try {
			const api = new TournamentAPI();
			const participants = await api.getTournamentParticipants(tournamentId, user.id);
			const participantsService = new ParticipantsService();
			const isJoined = participantsService.alreadyJoinedTournament(participants, user.id);
			if (isJoined == false) {
				console.log('You are not a participant in this tournament. Please join first.');
				return;
			}
			const battleService = new BattleAPI();
			const isReady = participantsService.alreadyReadyForBattle(participants, user.id);
			if (!isReady) {
				await battleService.ready(tournamentId, user.id);
			}
			console.log('Ready signal sent successfully!');

			console.log('Waiting for battle to be ready... ( Cancel with Ctrl+C )');
			const waitService = new WaitUntilCanBattle();
			const roomData = await waitService.waitForBattleReady(tournamentId, user.id)
			.then((roomData) => {
				return roomData;
			})
			.catch(async (error) => {
				battleService.cancel(tournamentId, user.id);
				throw new UsageError('Cancelled waiting for battle ready.');
			});
			console.log('Battle is ready! Room ID:', roomData.room_id);
			const gameService = new GameService();
			return await gameService.connectToGameWebSocket(roomData.room_id, user.id);
		} catch (error) {
			if (error instanceof BattleError) {
				console.error('Can not ready: ', error);
				return;
			}
			else if (error instanceof UsageError) {
				console.error(error.message);
				return;
			}
			throw error;
		}
	}
}
