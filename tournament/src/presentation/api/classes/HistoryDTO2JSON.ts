import { HistoryDTO } from "../../../application/dto/HistoryDTO";
import { HistorySchema } from "../schemas/HistorySchema";


export class HistoryDTO2JSON {

	static toJSON(DTO: HistoryDTO): HistorySchema {
		return {
			id: DTO.id,
			tournament_id: DTO.tournamentId,
			loser: DTO.loser,
			winner: DTO.winner,
			created_at: DTO.created_at.toISOString(),
		}
	}
}
