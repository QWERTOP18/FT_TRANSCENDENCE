import axios from "axios";
import { config } from "../../config/config";
import { GameRoomSchema } from "../../controller/schemas/GameRoomSchema";

class GameService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}`;
  }

  async createGame(
    tournamentId: string,
    participantIds: string[],
    tournamentRule: string
  ): Promise<GameRoomSchema> {
    console.log(`createGame: ${this.endpoint}/room`);
    const response = await axios.post(`${this.endpoint}/room`, {
      tournament_id: tournamentId,
      player1_id: participantIds[0],
      player2_id: participantIds[1],
      winning_score: tournamentRule === "simple" ? 5 : 10,
    });
    console.log(response.data);
    return response.data;
  }

  async createAiGame(request: any): Promise<GameRoomSchema> {
    console.log("createAiGame");
    console.log(`${this.endpoint}/play-ai`);

    // todo fetch ai level from request or config
    const aiLevel = request?.aiLevel || 8;
    const response = await axios.post(`${this.endpoint}/play-ai`, {
      user_id: "ai",
      aiLevel: aiLevel,
    });
    console.log(response.data);
    return response.data;
  }
}

export const gameService = new GameService(config.gameURL);
