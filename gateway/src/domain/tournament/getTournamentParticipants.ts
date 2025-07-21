import axios from "axios";
import { config } from "../../config/config";

export async function getTournamentParticipants(id: string) {
  const response = await axios.get(
    `${config.tournamentURL}/tournaments/${id}/participants`
  );
  return response.data;
}
