import { MenuService } from "../services/menuService";
import { BattleAIService } from "./BattleAIService";
import { TournamentListService } from "./TournamentListService";


export class MainMenuService {
	async showMainMenu() {
		const menuService = new MenuService();
		const menuMap = {
			'1': new BattleAIService().battleAI, // AIバトルを開始
			'2': new TournamentListService().getTournaments, // トーナメント一覧を表示
			'3': async () => { }, // アプリケーションを終了
		}
		try {
			const choice = await menuService.showMainMenu();
			await menuMap[choice]();
			return;
		} catch (error) {
			console.error('Menu error:', error);
			console.log('Returning to main menu...');
		}
	}
}
