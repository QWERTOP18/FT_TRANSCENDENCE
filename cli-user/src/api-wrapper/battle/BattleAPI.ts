import axios from "axios";
import { BattleError, BattleErrorSchema } from "./BattleError";
import { config } from "../../config/config";



export type BattleAISchema = {
  room_id: string;
}

export type BattleRoomSchema = {
  room_id: string;
}

export class BattleAPI {
  async startAIBattle(): Promise<BattleAISchema> {
    const resp = await this.sendAPIRequest<BattleAISchema | string>(`battle/ai`, {}, 'POST');
    if (typeof resp === 'string') {
      return { room_id: resp };
    }
    else if (typeof resp === 'object' && 'room_id' in resp) {
      return resp;
    }
    else {
      throw new Error('Invalid response format');
    }
  }

  async ready(tournamentId: string, userId: string): Promise<void> {
    return await this.sendAPIRequest<void>(`tournaments/${tournamentId}/battle/ready`, {}, 'PUT', userId);
  }

  async cancel(tournamentId: string, userId: string): Promise<void> {
    return await this.sendAPIRequest<void>(`tournaments/${tournamentId}/battle/cancel`, {}, 'PUT', userId);
  }

  async getTournamentRoomId(tournamentId: string, userId: string): Promise<BattleRoomSchema> {
    return await this.sendAPIRequest<BattleRoomSchema>(`tournaments/${tournamentId}/room`, {}, 'GET', userId);
  }

  async sendAPIRequest<T>(endpoint: string, body?: any, method: 'GET' | 'POST' | 'PUT' = 'GET', userId?: string): Promise<T> {
    const url = `${config.gatewayURL}${endpoint}`;
    const x_userId = userId || '';
    const headers = {
      'X-User-ID': x_userId,
      'Content-Type': 'application/json',
    };
    return await axios({
      url,
      method,
      data: body,
      headers,
    }).then((response) => {
      return response.data as T;
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as BattleErrorSchema;
        if (errorData) {
          throw new BattleError(errorData, url, method);
        }
      }
      throw error;
    });
  }
} 
