import axios from "axios";
import { config } from "../../config/config";

export async function getTournaments() {
  const endpoint = `${config.tournamentURL}/tournaments`;
  const response = await axios.get(endpoint);
  return response.data;
}
