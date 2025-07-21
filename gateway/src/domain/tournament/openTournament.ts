import axios from "axios";
import { config } from "../../config/config";

export async function openTournament(id: string) {
  const response = await axios.put(
    `${config.tournamentURL}/tournaments/${id}/open`
  );
  return response.data;
}
