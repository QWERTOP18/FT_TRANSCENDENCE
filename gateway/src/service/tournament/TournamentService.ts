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

  async getTournamentParticipants(request: any) {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}/participants`, {});
    return response.data;
  }

  async getTournament(request: any) {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}`, {});
    return response.data;
  }

  async joinTournament(request: any) {
    const id = request.params.id;
    const externalId = request.headers["x-user-id"];
    const response = await axios.post(`${this.endpoint}/${id}/participants`, {
      external_id: externalId,
    });
    return response.data;
  }

  async openTournament(request: any) {
    const id = request.params.id;
    const externalId = request.headers["x-user-id"];
    console.log(externalId);
    const response = await axios.put(
      `${this.endpoint}/${id}/open`,
      {},
      {
        headers: {
          "x-external-id": externalId,
        },
      }
    );
    return response.data;
  }

  async createTournament(request: any) {
    const externalId = request.headers["x-user-id"];

     console.log({
      ...request.body,
      ownerExternalId: externalId,
      ownerName: "<TODO: Owner Name>"
    })

    // todo : ownerName should be passed from the request body or headers
    const response = await axios.post(this.endpoint, {
      ...request.body,
      ownerExternalId: externalId,
      ownerName: "<TODO: Owner Name>"
    });

    return response.data;
  }

  async getTournamentHistory(request: any) {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}/history`, {});
    return response.data;
  }
}

export const tournamentService = new TournamentService(config.tournamentURL);
