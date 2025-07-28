import WebSocket from 'ws';
import { config } from '../config/config';
import { GameMessage, GameState } from '../types/game';
import { KeyboardService } from './keyboardService';

export class GameService {
  private keyboardService: KeyboardService;

  constructor() {
    this.keyboardService = new KeyboardService();
  }

  connectToGameWebSocket(roomId: string, userId: string): void {
    const wsUrl = `${config.wssURL}/game/${roomId}?user_id=${userId}`;
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    this.displayControls();
    
    const ws = new WebSocket(wsUrl);
    
    // WebSocket接続の詳細なログを追加
    ws.on('open', () => {
      console.log('WebSocket connection established!');
      console.log('Game is ready. Use the controls above to play.');
      
      // キーボード入力を設定
      this.keyboardService.setupKeyboardInput(ws);
    });
    
    ws.on('message', (data) => {
      console.log('Received WebSocket message:', data.toString());
      this.handleGameMessage(data);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', (code, reason) => {
      console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
      console.log('Close event details:', { code, reason: reason.toString() });
      process.exit(0);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\nClosing WebSocket connection...');
      this.keyboardService.cleanup();
      ws.close();
      process.exit(0);
    });
  }

  private handleGameMessage(data: WebSocket.Data): void {
    try {
      const message: GameMessage = JSON.parse(data.toString());
      
      if (message.type === 'gameState') {
        const state = message.state as GameState;
        if (state) {
          this.displayGameState(state);
        }
      } else {
        console.log('Received message:', message);
      }
    } catch (error) {
      console.log('Received raw message:', data.toString());
    }
  }

  private displayGameState(state: GameState): void {
    console.clear();
    console.log('=== PONG GAME ===');
    console.log(`Score: ${state.score1} - ${state.score2}`);
    console.log(`Ball Position: (${state.ballX.toFixed(1)}, ${state.ballY.toFixed(1)})`);
    console.log(`Paddle 1 Y: ${state.paddle1Y.toFixed(1)}`);
    console.log(`Paddle 2 Y: ${state.paddle2Y.toFixed(1)}`);
    console.log('\nControls: W/S or Arrow Keys to move, Ctrl+C to exit');
  }

  private displayControls(): void {
    console.log('Controls:');
    console.log('  W/Up Arrow: Move paddle up');
    console.log('  S/Down Arrow: Move paddle down');
    console.log('  A/Left Arrow: Move paddle left');
    console.log('  D/Right Arrow: Move paddle right');
    console.log('  Ctrl+C: Exit');
  }
} 
