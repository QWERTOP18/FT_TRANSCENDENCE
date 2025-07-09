import { HistoryDTO } from "../../../application/dto/HistoryDTO";


export class HistoryDTO2JSON {

	static toJSON(DTO: HistoryDTO) {
		return {
			id: DTO.id,
			tournament_id: DTO.tournamentId,
			loser: DTO.loser,
			winner: DTO.winner,
			created_at: DTO.created_at.toISOString(),
		}
	}
}
