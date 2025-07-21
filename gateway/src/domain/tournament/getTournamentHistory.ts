import axios from "axios";
import { config } from "../../config/config";

export async function getTournamentHistory(id: string) {
  const response = await axios.get(
    `${config.tournamentURL}/tournaments/${id}/history`
  );
  return response.data;
}
