import axios from "axios";
import { config } from "../../config/config";

class TournamentService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}/tournaments`;
  }

  async getTournaments() {
    const response = await axios.get(this.endpoint);
    return response.data;
  }

  async getTournamentParticipants(id: string) {
    const response = await axios.get(`${this.endpoint}/${id}/participants`);
    return response.data;
  }

  async getTournament(id: string) {
    const response = await axios.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async openTournament(id: string) {
    const response = await axios.put(`${this.endpoint}/${id}/open`);
    return response.data;
  }

  async createTournament(requestBody: any) {
    const response = await axios.post(this.endpoint, requestBody);
    return response.data;
  }

  async getTournamentHistory(id: string) {
    const response = await axios.get(`${this.endpoint}/${id}/history`);
    return response.data;
  }
}

export const tournamentService = new TournamentService(config.tournamentURL);
