import { randomUUID } from "crypto";
import { GameState } from "./GameState";
import { WebSocket } from "ws";
import { GameRoomSchema } from "../presentation/schemas/GameRoomSchema";

export class GameRoom {
  public readonly room_id: string;
  public readonly token_player1: string;
  public readonly token_player2: string;
  public readonly token_watcher: string;
  public readonly gameState: GameState;
  public player1: WebSocket | null = null;
  public player2: WebSocket | null = null;
  public watchers: Set<WebSocket> = new Set();

  constructor() {
    this.room_id = randomUUID();
    this.token_player1 = randomUUID();
    this.token_player2 = randomUUID();
    this.token_watcher = randomUUID();
    this.gameState = new GameState();
  }

  assignPlayer(ws: WebSocket) {
    if (this.player1 === null) {
      this.player1 = ws;
      return "player1";
    } else if (this.player2 === null) {
      this.player2 = ws;
      return "player2";
    } else {
      this.watchers.add(ws);
      return "watcher";
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
      token_player1: this.token_player1,
      token_player2: this.token_player2,
      token_watcher: this.token_watcher,
    };
  }
}
