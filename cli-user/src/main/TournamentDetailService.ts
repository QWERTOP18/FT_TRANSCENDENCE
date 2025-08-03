import { TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";
import { LoginSessionService } from "../services/LoginSessionService";
import { MenuService } from "../services/menuService";
import { JoinTournamentService } from "./JoinTournamentService";
import { ReadyService } from "./ReadyService";


export class TournamentDetailService {
	async tournamentDetailMenu(tournamentId: string) {
		const user = LoginSessionService.getCurrentUser();
		const tournament = await new TournamentAPI().getTournament(tournamentId, user.id);
		const menuService = new MenuService();
		const selection = await menuService.showTournamentDetailsMenu(tournament);
		if (selection === 'join') {
			await new JoinTournamentService().joinTournament(tournament.id);
		} else if (selection === 'ready') {
			await new ReadyService().readyForTournament(tournament.id);
		}
		return selection;
	}
}
