import { TournamentDTO } from "../../../application/dto/TournamentDTO";
import { TournamentSchema } from "../schemas/TournamentSchema";


export class TournamentDTO2JSON {

	static toJSON(DTO: TournamentDTO): TournamentSchema {
		return {
			id: DTO.id,
			name: DTO.name,
			champion_id: DTO.championId ?? '',
			owner_id: DTO.ownerId,
			description: DTO.description,
			state: DTO.state,
			participants: DTO.participants.map(p => p.id),
			histories: DTO.histories.map(h => h.id),
		}
	}
}
