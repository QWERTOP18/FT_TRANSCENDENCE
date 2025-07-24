import axios from "axios";
import { config } from "../../config/config";
import { gameService } from "../game/GameService";

class BattleService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}/tournaments`;
  }

  async readyBattle(request: any) {
    const tournamentId = request.params.tournament_id;
    const userId = request.headers["x-user-id"];
    const participantId = await this.getParticipantId(tournamentId, userId);
    const response = await axios.post(
      `${this.endpoint}/${tournamentId}/participants/${participantId}/ready`,
      undefined,
      {
        headers: {
          "x-external-id": userId,
        },
      }
    );

    if ((await this.countReadyParticipants(tournamentId)) >= 2) {
      await gameService.createGame(tournamentId);
    }

    return response.data;
  }

  async cancelBattle(request: any) {
    const tournamentId = request.params.tournament_id;
    const userId = request.headers["x-user-id"];
    const participantId = await this.getParticipantId(tournamentId, userId);
    const response = await axios.post(
      `${this.endpoint}/${tournamentId}/participants/${participantId}/cancel`,
      undefined,
      {
        headers: {
          "x-external-id": userId,
        },
      }
    );
    return response.data;
  }

  private async countReadyParticipants(tournamentId: string) {
    const participants = await this.getParticipants(tournamentId);
    return participants.filter((participant: any) => participant.ready).length;
  }

  private async getParticipantId(tournamentId: string, userId: string) {
    const participants = await this.getParticipants(tournamentId);
    const participant = participants.find(
      (participant: any) => participant.external_id === userId
    );
    return participant.id;
  }

  private async getParticipants(tournamentId: string) {
    const response = await axios.get(
      `${this.endpoint}/${tournamentId}/participants`
    );
    return response.data;
  }
}

export const battleService = new BattleService(config.tournamentURL);
