import { randomUUID } from "crypto";
import { GameState } from "./GameState";
import { WebSocket } from "ws";
import { GameRoomSchema } from "../presentation/schemas/GameRoomSchema";

export class GameRoom {
  public readonly room_id: string;
  public readonly tournament_id: string;
  public readonly player1_id: string;
  public readonly player2_id: string;
  public readonly gameState: GameState;
  public player1: WebSocket | null = null;
  public player2: WebSocket | null = null;
  public watchers: Set<WebSocket> = new Set();

  constructor(body: any) {
    this.room_id = randomUUID();
    this.tournament_id = body.tournament_id;
    this.player1_id = body.player1_id;
    this.player2_id = body.player2_id;
    this.gameState = new GameState(body.winning_score);
  }

  assignPlayer(ws: WebSocket, id: string) {
    if (id === this.player1_id) {
      this.player1 = ws;
    } else if (id === this.player2_id) {
      this.player2 = ws;
    } else {
      this.watchers.add(ws);
    }
    if (this.player1 != null && this.player2 != null) {
      this.gameState.startGame();
    }
  }

  removeClient(ws: WebSocket) {
    if (ws === this.player1) {
      this.player1 = null;
    } else if (ws === this.player2) {
      this.player2 = null;
    } else {
      this.watchers.delete(ws);
    }
  }

  toSchema(): GameRoomSchema {
    return {
      room_id: this.room_id,
      player1_id: this.player1_id,
      player2_id: this.player2_id,
      tournament_id: this.tournament_id,
    };
  }
}
