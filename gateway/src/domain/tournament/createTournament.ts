import axios from "axios";
import { config } from "../../config/config";

export async function createTournament({
  name,
  description,
  max_num,
}: {
  name: string;
  description: string;
  max_num: number;
}) {
  const response = await axios.post(`${config.tournamentURL}/tournaments`, {
    name,
    description,
    max_num,
  });
  return response.data;
}
