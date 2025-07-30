import axios from "axios";
import { config } from "../../config/config";
import { getUser } from "../auth/AuthService";
import { TournamentSchema } from "../../controller/schemas/TournamentSchema";

class TournamentService {
  private endpoint: string;

  constructor(baseURL: string) {
    this.endpoint = `${baseURL}/tournaments`;
  }

  async getTournaments(request?: any) {
    const response = await axios.get(this.endpoint);
    const tournaments = response.data;

    // If no request provided (no user context), return tournaments as is
    if (!request || !request.headers["x-user-id"]) {
      return tournaments;
    }

    // Add is_participating and is_owner fields for each tournament
    const externalId = request.headers["x-user-id"];
    const tournamentsWithUserInfo = await Promise.all(
      tournaments.map(async (tournament: any) => {
        try {
          const participantsResponse = await axios.get(
            `${this.endpoint}/${tournament.id}/participants`
          );
          const participants = participantsResponse.data;
          const isParticipating = participants.some(
            (participant: any) => participant.external_id === externalId
          );

          // Check if current user is the owner by comparing with owner_id
          // We need to find the owner participant to get their external_id
          const ownerParticipant = participants.find(
            (participant: any) => participant.id === tournament.owner_id
          );
          const isOwner = ownerParticipant
            ? ownerParticipant.external_id === externalId
            : false;

          return {
            ...tournament,
            is_participating: isParticipating,
            is_owner: isOwner,
          };
        } catch (error) {
          // If we can't fetch participants, assume not participating and not owner
          return {
            ...tournament,
            is_participating: false,
            is_owner: false,
          };
        }
      })
    );

    return tournamentsWithUserInfo;
  }

  async getTournamentParticipants(request: any) {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}/participants`, {});
    return response.data;
  }

  async getTournament(request: any): Promise<TournamentSchema> {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}`, {});
    const tournament = response.data;

    // If no user context, return tournament as is
    if (!request.headers["x-user-id"]) {
      return tournament;
    }

    // Add is_participating and is_owner fields
    const externalId = request.headers["x-user-id"];
    try {
      const participantsResponse = await axios.get(
        `${this.endpoint}/${id}/participants`
      );
      const participants = participantsResponse.data;
      const isParticipating = participants.some(
        (participant: any) => participant.external_id === externalId
      );

      // Check if current user is the owner by comparing with owner_id
      const ownerParticipant = participants.find(
        (participant: any) => participant.id === tournament.owner_id
      );
      const isOwner = ownerParticipant
        ? ownerParticipant.external_id === externalId
        : false;

      return {
        ...tournament,
        is_participating: isParticipating,
        is_owner: isOwner,
      };
    } catch (error) {
      // If we can't fetch participants, assume not participating and not owner
      return {
        ...tournament,
        is_participating: false,
        is_owner: false,
      };
    }
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

    // Add is_participating and is_owner fields since the creator is automatically both
    return {
      ...response.data,
      is_participating: true,
      is_owner: true,
    };
  }

  async getTournamentHistory(request: any) {
    const id = request.params.id;
    const response = await axios.get(`${this.endpoint}/${id}/history`, {});
    return response.data;
  }
}

export const tournamentService = new TournamentService(config.tournamentURL);
