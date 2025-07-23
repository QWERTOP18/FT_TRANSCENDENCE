import axios from "axios";
import { config } from "../../config/config";

class GameService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}`;
  }

  async createGame(tournamentId: string) {
    const response = await axios.post(`${this.endpoint}/${tournamentId}`);
    return response.data;
  }
}

export const gameService = new GameService(config.gameURL);
