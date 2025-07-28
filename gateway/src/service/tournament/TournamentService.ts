import axios from "axios";
import { config } from "../../config/config";
import { getUser } from "../auth/AuthService";
import { TournamentSchema } from "../../controller/schemas/TournamentSchema";

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

  async getTournament(request: any): Promise<TournamentSchema> {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}`, {});
    return response.data;
  }

  async joinTournament(request: any) {
    const id = request.params.id;
    const externalId = request.headers["x-user-id"];
    const user = await getUser(externalId);
    const response = await axios.post(`${this.endpoint}/${id}/participants`, {
      external_id: externalId,
      name: user.name,
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
    const user = await getUser(externalId);

    console.log({
      ...request.body,
      ownerExternalId: externalId,
      ownerName: user.name,
    });

    const response = await axios.post(this.endpoint, {
      ...request.body,
      ownerExternalId: externalId,
      ownerName: user.name,
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
