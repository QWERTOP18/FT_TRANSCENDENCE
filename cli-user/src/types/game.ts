export interface BattleAIResponse {
  room_id: string;
}

export interface GameState {
  paddle1Y: number;
  paddle2Y: number;
  ballX: number;
  ballY: number;
  score1: number;
  score2: number;
}

export interface GameMessage {
  type: string;
  state?: GameState;
  [key: string]: any;
} 
