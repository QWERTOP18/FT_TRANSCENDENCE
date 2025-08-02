import axios from "axios";
import { config } from "../../config/config";
import { gameService } from "../game/GameService";
import { err } from "pino-std-serializers";
import { GameRoomSchema } from "../../controller/schemas/GameRoomSchema";
import { tournamentService } from "../tournament/TournamentService";

class BattleService {
  private endpoint: string;
  private roomIdMap: Map<string, string> = new Map(); // tournamentId -> roomId

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

      // todo receptionの時に500が帰ってしまうので、tournamentサービスのエラーを適切に伝播させる
      if (response.status !== 200) {
        throw new Error("Failed to ready battle");
      }

      const readyCount = await this.countReadyParticipants(tournamentId);

      if (readyCount >= 2) {
        const readyParticipantIds =
          await this.getReadyParticipantIds(tournamentId);

        // 参加者をin_progress状態にする
        await this.notifyGameInprogress(tournamentId, readyParticipantIds);

        // トーナメントのルールを取得
        const tournament = await tournamentService.getTournament({
          params: { id: tournamentId },
          headers: { "x-user-id": userId },
        });
        const tournamentRule = tournament.rule;

        // ゲームルームを作成
        const gameRoom = await gameService.createGame(
          tournamentId,
          readyParticipantIds,
          tournamentRule
        );
        console.log(gameRoom);

        // roomIdを保存
        this.roomIdMap.set(tournamentId, gameRoom.room_id);
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
    const readyParticipants = participants.filter(
      (participant: any) => participant.state === "ready"
    );
    return readyParticipants.length;
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

  private async convertExternalIdsToParticipantIds(
    tournamentId: string,
    externalIds: string[]
  ): Promise<string[]> {
    const participants = await this.getParticipants(tournamentId);

    const participantIds = externalIds.map((externalId) => {
      const participant = participants.find(
        (p: any) => p.external_id === externalId
      );
      if (!participant) {
        throw new Error(`Participant not found for external_id: ${externalId}`);
      }
      return participant.id;
    });

    console.log(
      `Converted external IDs ${externalIds} to participant IDs: ${participantIds}`
    );
    return participantIds;
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
    const readyParticipants = participants
      .filter((participant: any) => participant.state === "ready")
      .slice(0, 2);
    return readyParticipants.map((participant: any) => participant.id);
  }

  private async notifyGameInprogress(
    tournamentId: string,
    readyParticipantIds: string[]
  ) {
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

  async aiOpponent(request: any): Promise<GameRoomSchema> {
    try {
      const response = await gameService.createAiGame(request);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async endBattle(request: any) {
    try {
      const tournamentId = request.params.id;
      const battleResult = request.body;

      // external_idをparticipant_idに変換
      const winnerExternalId = battleResult.winner.id;
      const loserExternalId = battleResult.loser.id;

      const [winnerParticipantId, loserParticipantId] =
        await this.convertExternalIdsToParticipantIds(tournamentId, [
          winnerExternalId,
          loserExternalId,
        ]);

      // 変換されたparticipant_idでゲーム結果を作成
      const convertedBattleResult = {
        winner: {
          id: winnerParticipantId,
          score: battleResult.winner.score,
        },
        loser: {
          id: loserParticipantId,
          score: battleResult.loser.score,
        },
      };

      console.log("Converting battle result:", {
        original: battleResult,
        converted: convertedBattleResult,
      });

      const response = await axios.post(
        `${this.endpoint}/${tournamentId}/battle/end`,
        convertedBattleResult,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRoomId(
    tournamentId: string,
    userId: string
  ): Promise<string | null> {
    // 参加者かどうかを確認
    try {
      const participantId = await this.getParticipantId(tournamentId, userId);
      const roomId = this.roomIdMap.get(tournamentId);
      return roomId || null;
    } catch (error) {
      return null;
    }
  }
}

export const battleService = new BattleService(config.tournamentURL);
