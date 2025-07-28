import axios from "axios";
import { config } from "../../config/config";

class GameService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}`;
  }

  async createGame(tournamentId: string, participantIds: string[]) {
    const response = await axios.post(`${this.endpoint}/room`, {
      tournament_id: tournamentId,
      participant_ids: participantIds,
    });
    console.log(response.data);
    return response.data;
  }

  private async connectGame(gameRoomId: string) {
    const ws = new WebSocket(`${config.wsURL}/room/${gameRoomId}/watch`);
    ws.onmessage = (event) => {
      console.log(event.data);
    };
    ws.onopen = () => {
      console.log("Connected to game");
    };
    ws.onclose = () => {
      console.log("Disconnected from game");
    };
    ws.onerror = (error) => {
      console.log("Error:", error);
    };
  }
}

export const gameService = new GameService(config.gameURL);
