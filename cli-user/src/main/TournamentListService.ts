import { TournamentAPI } from "../api-wrapper/tournament/TournamentAPI";
import { LoginSessionService } from "../services/LoginSessionService";
import { MenuService } from "../services/menuService";
import { TournamentDetailService } from "./TournamentDetailService";


export class TournamentListService {
	async getTournaments() {
		const user = LoginSessionService.getCurrentUser();
		const menuService = new MenuService();
		try {
			while (true) {
				const api = new TournamentAPI();
				const tournaments = await api.getTournaments(user.id);
				const selectedTournamentId = await menuService.selectTournamentMenu(tournaments);
				if (selectedTournamentId === null) {
					break;
				}
				const selection = await new TournamentDetailService().tournamentDetailMenu(selectedTournamentId);
				if (selection === 'back') {
					break;
				}
			}
		}
		catch (error) {
			console.error('Tournament menu error:', error);
		}
		console.log('Returning to main menu...');
	}
}
