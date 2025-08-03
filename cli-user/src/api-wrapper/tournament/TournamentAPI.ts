import axios from "axios";
import { config } from "../../config/config";
import { TournamentError, TournamentErrorSchema } from "./TournamentError";

export interface Tournament {
  id: string;
  name: string;
  status: string;
  participants: number;
  maxParticipants: number;
  createdAt: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  name: string;
  external_id: string;
  state: string;
}

export class TournamentAPI {
  async getTournaments(userId: string): Promise<Tournament[]> {
    return await this.sendAPIRequest<Tournament[]>(`tournaments`, undefined, 'GET', userId);
  }

  async joinTournament(tournamentId: string, userId: string): Promise<{
    ok: true;
  }> {
    return await this.sendAPIRequest<{ ok: true }>(`tournaments/${tournamentId}/join`, {}, 'POST', userId);
  }

  async getTournamentParticipants(tournamentId: string, userId: string): Promise<TournamentParticipant[]> {
    return await this.sendAPIRequest<TournamentParticipant[]>(`tournaments/${tournamentId}/participants`, undefined, 'GET', userId);
  }

  async getTournament(tournamentId: string, userId: string): Promise<Tournament> {
    return await this.sendAPIRequest<Tournament>(`tournaments/${tournamentId}`, undefined, 'GET', userId);
  }

  async sendAPIRequest<T>(endpoint: string, body?: any, method: 'GET' | 'POST' = 'GET', userId?: string): Promise<T> {
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
        const errorData = error.response?.data as TournamentErrorSchema;
        if (errorData) {
          throw new TournamentError(errorData, url);
        }
      }
      throw error;
    });
  }
} 
