import axios from 'axios';
import { config } from '../config/config';
import { ErrorResponse } from '../errors/JoinErrorResponse';

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

export class TournamentService {
  async getTournaments(userId: string): Promise<Tournament[]> {
    try {
      console.log('Fetching tournaments...');

      const response = await axios.get(`${config.gatewayURL}tournaments`, {
        headers: {
          'X-User-ID': userId,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((tournament: any) => ({
          id: tournament.id,
          name: tournament.name,
          status: tournament.state,
          participants: tournament.participants?.length || 0,
          maxParticipants: tournament.max_num || 8,
          createdAt: tournament.createdAt
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  async joinTournament(tournamentId: string, userId: string): Promise<{
    ok: true;
  }> {
    try {
      const response = await axios.post(
        `${config.gatewayURL}tournaments/${tournamentId}/join`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ErrorResponse(error.response?.data?.error);
      }
      throw error;
    }
  }

  async getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
    try {
      console.log(`Fetching participants for tournament ${tournamentId}...`);
      const response = await axios.get(`${config.gatewayURL}tournaments/${tournamentId}/participants`);

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((participant: any) => ({
          id: participant.id,
          tournament_id: participant.tournament_id,
          name: participant.name,
          external_id: participant.external_id,
          state: participant.state,
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch tournament participants:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }
} 
