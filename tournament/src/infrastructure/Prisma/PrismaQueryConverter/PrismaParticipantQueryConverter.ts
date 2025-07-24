import { Participant as PrismaParticipant } from "@prisma/client";
import { Participant } from "../../../domain/tournament/entities/Participant";
import { ParticipantId } from "../../../domain/tournament/value-objects/ParticipantId";
import { TournamentId } from "../../../domain/tournament/value-objects/TournamentId";
import { ParticipantState } from "../../../domain/tournament/value-objects/ParticipantState";

export class PrismaParticipantQueryConverter {

	static create(participant: Participant) {
		return {
			id: participant.id.value,
			external_id: participant.externalId,
			name: participant.name,
			state: participant.state.value,
		};
	}

	static update(participant: Participant) {
		return {
			external_id: participant.externalId,
			name: participant.name,
			state: participant.state.value,
		};
	}

	static toDomain(participant: PrismaParticipant): Participant {
		return Participant.reconstruct({
			id: new ParticipantId(participant.id),
			externalId: participant.external_id,
			name: participant.name,
			tournamentId: new TournamentId(participant.tournament_id),
			state: new ParticipantState(participant.state)
		})
	}
}
