import axios from 'axios';
import { config } from '../config/config';

export interface Tournament {
  id: string;
  name: string;
  status: string;
  participants: number;
  maxParticipants: number;
  createdAt: string;
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
          status: tournament.status,
          participants: tournament.participants?.length || 0,
          maxParticipants: tournament.maxParticipants || 8,
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

  async joinTournament(tournamentId: string, userId: string): Promise<string> {
    try {
      console.log(`Joining tournament ${tournamentId}...`);
      const response = await axios.post(
        `${config.gatewayURL}tournament/${tournamentId}/join`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      
      console.log('Successfully joined tournament!');
      
      // レスポンスからroom_idを取得
      let roomId: string;
      if (typeof response.data === 'string') {
        roomId = response.data;
      } else if (response.data && typeof response.data === 'object' && 'room_id' in response.data) {
        roomId = response.data.room_id;
      } else {
        throw new Error('Invalid response format');
      }
      
      return roomId;
    } catch (error) {
      console.error('Failed to join tournament:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }
} 
