import axios from "axios";
import { config } from "../../config/config";
import { gameService } from "../game/GameService";

class BattleService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}/tournaments`;
  }

  async readyBattle(request: any) {
    try {
      const tournamentId = request.params.id;
      const userId = request.headers["x-user-id"];

      const participantId = await this.getParticipantId(tournamentId, userId);

      const response = await axios.put(
        `${this.endpoint}/${tournamentId}/participants/${participantId}/ready`,
        null,
        {
          headers: {
            "x-external-id": userId,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(await this.countReadyParticipants(tournamentId));
      if ((await this.countReadyParticipants(tournamentId)) >= 2) {
        console.log("Creating game");
        const readyParticipantIds =
          await this.getReadyParticipantIds(tournamentId);

        // 参加者をin_progress状態にする
        await this.notifyGameInprogress(tournamentId, readyParticipantIds);

        // ゲームルームを作成 ここからは非同期処理
        const gameRoom = gameService.createGame(
          tournamentId,
          readyParticipantIds
        );
        console.log("Game room created");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelBattle(request: any) {
    const tournamentId = request.params.id;
    const userId = request.headers["x-user-id"];
    const participantId = await this.getParticipantId(tournamentId, userId);
    const response = await axios.put(
      `${this.endpoint}/${tournamentId}/participants/${participantId}/cancel`,
      null,
      {
        headers: {
          "x-external-id": userId,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  private async countReadyParticipants(tournamentId: string) {
    const participants = await this.getParticipants(tournamentId);
    return participants.filter(
      (participant: any) => participant.state === "ready"
    ).length;
  }

  private async getParticipantId(tournamentId: string, userId: string) {
    const participants = await this.getParticipants(tournamentId);
    const participant = participants.find(
      (participant: any) => participant.external_id === userId
    );
    if (!participant) {
      throw new Error(
        `Participant not found for userId: ${userId} in tournament: ${tournamentId}`
      );
    }
    return participant.id;
  }

  private async getParticipants(tournamentId: string) {
    try {
      const response = await axios.get(
        `${this.endpoint}/${tournamentId}/participants`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async getReadyParticipantIds(tournamentId: string) {
    const participants = await this.getParticipants(tournamentId);
    return participants
      .filter((participant: any) => participant.state === "ready")
      .slice(0, 2)
      .map((participant: any) => participant.id);
  }

  private async notifyGameInprogress(
    tournamentId: string,
    readyParticipantIds: string[]
  ) {
    console.log(readyParticipantIds);
    const response = await axios.put(
      `${this.endpoint}/${tournamentId}/battle/start`,
      readyParticipantIds
    );
    return response.data;
  }

  private async notifyGameEnd(tournamentId: string, gameResult: any) {
    const response = await axios.put(
      `${this.endpoint}/${tournamentId}/battle/end`,
      gameResult
    );
    return response.data;
  }
}

export const battleService = new BattleService(config.tournamentURL);
