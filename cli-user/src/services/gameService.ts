import { DisplayStageService } from '../main/DisplayStageService';
import { GameState } from '../types/game';
import { GameEndData, GameWebSocket } from '../websocket-wrapper/game/GameWebSocket';
import { KeyboardService } from './keyboardService';

export class GameService {
  private keyboardService: KeyboardService;

  constructor() {
    this.keyboardService = new KeyboardService();
  }

  connectToGameWebSocket(roomId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new GameWebSocket(roomId, userId);
      
      // WebSocket接続の詳細なログを追加
      ws.on('open', () => {
        // キーボード入力を設定
        this.keyboardService.setupKeyboardInput(ws);
      });

      ws.onGameState((state) => {
        this.displayGameState(state);
      })

      ws.onEnd((state) => {
        this.displayGameEnd(state);
        resolve();
      })
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      });
      
      ws.on('close', (code, reason) => {
        console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
        console.log('Close event details:', { code, reason: reason.toString() });
        resolve();
      });
      
      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\nClosing WebSocket connection...');
        ws.close();
        reject(new Error('Game terminated by user'));
      });
    })
  }
  
  private displayGameState(state: GameState): void {
    console.clear();
    console.log('=== PONG GAME ===');
    console.log(`Score: ${state.score1} - ${state.score2}`);
    console.log(`Ball Position: (${state.ballX.toFixed(1)}, ${state.ballY.toFixed(1)})`);
    console.log(`Paddle 1 Y: ${state.paddle1Y.toFixed(1)}`);
    console.log(`Paddle 2 Y: ${state.paddle2Y.toFixed(1)}`);
    console.log('\nControls: W/S or Arrow Keys to move, Ctrl+C to exit');
    const displayService = new DisplayStageService();
    console.log(displayService.generateStage(state));
  }

  private displayGameEnd(state: GameEndData['state']): void {
    console.clear();
    console.log('=== GAME OVER ===');
    console.log(`Final Score: ${state.score1} - ${state.score2}`);
    console.log('Thank you for playing!');
    this.keyboardService.cleanup();
    process.exit(0);
  }
} 
