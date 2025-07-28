import { config } from './config/config';
import { BattleService } from './services/battleService';
import { GameService } from './services/gameService';
import { UserService } from './services/userService';
import { User } from './types/auth';

async function main(): Promise<void> {
  try {
    const userService = new UserService();
    const battleService = new BattleService();
    const gameService = new GameService();

    // ユーザー認証
    const user: User = await userService.authenticateUser();
    console.log(`User ID: ${user.id}`);
    
    // Start AI battle and get room ID
    const roomId = await battleService.startAIBattle();
    
    // Connect to WebSocket with authenticated user
    gameService.connectToGameWebSocket(roomId, user.id);
    
  } catch (error) {
    console.error('Application failed:', error);
    process.exit(1);
  }
}

// Run the application
main(); 
