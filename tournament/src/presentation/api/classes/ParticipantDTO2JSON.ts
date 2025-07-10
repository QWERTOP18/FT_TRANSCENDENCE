import { ParticipantDTO } from "../../../application/dto/ParticipantDTO";
import { ParticipantSchema } from "../schemas/ParticipantSchema";


export class ParticipantDTO2JSON {

	static toJSON(DTO: ParticipantDTO): ParticipantSchema {
		return {
			id: DTO.id,
			tournament_id: DTO.tournamentId,
			external_id: DTO.externalId,
			state: DTO.state
		}
	}
}
