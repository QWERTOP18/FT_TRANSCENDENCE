import axios from "axios";
import { config } from "../../config/config";

export async function getTournament(id: string) {
  const response = await axios.get(`${config.tournamentURL}/tournaments/${id}`);
  return response.data;
}
