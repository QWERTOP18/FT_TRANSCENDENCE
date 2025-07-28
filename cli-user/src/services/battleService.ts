import axios from 'axios';
import { config } from '../config/config';
import { BattleAIResponse } from '../types/game';

export class BattleService {
  async startAIBattle(): Promise<string> {
    try {
      console.log('Starting AI battle...');
      const response = await axios.post(
        `${config.gatewayURL}battle/ai`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('AI battle started successfully!');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
      
      // レスポンスが文字列の場合は直接使用、オブジェクトの場合はroom_idプロパティを使用
      let roomId: string;
      if (typeof response.data === 'string') {
        roomId = response.data;
      } else if (response.data && typeof response.data === 'object' && 'room_id' in response.data) {
        roomId = response.data.room_id;
      } else {
        throw new Error('Invalid response format');
      }
      
      console.log(`Room ID: ${roomId}`);
      
      if (!roomId) {
        throw new Error('Room ID is undefined in response');
      }
      
      return roomId;
    } catch (error) {
      console.error('Failed to start AI battle:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }
} 
