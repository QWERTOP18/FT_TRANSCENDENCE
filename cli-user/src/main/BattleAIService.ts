import { BattleAPI } from "../api-wrapper/battle/BattleAPI";
import { GameService } from "../services/gameService";
import { LoginSessionService } from "../services/LoginSessionService";


export class BattleAIService {
	
	async battleAI() {
		  const user = LoginSessionService.getCurrentUser();
		  const api = new BattleAPI();
          console.log('\nStarting AI battle...');
          const resp = await api.startAIBattle();
          const gameService = new GameService();
          return await gameService.connectToGameWebSocket(resp.room_id, user.id);
	}
}
