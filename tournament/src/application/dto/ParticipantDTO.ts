import { Participant } from "../../domain/tournament/entities/Participant";
import { ParticipantStateValue } from "../../domain/tournament/value-objects/ParticipantState";

export class ParticipantDTO {
	private constructor(
		public id: string,
		public tournamentId: string,
		public externalId: string,
		public name: string,
		public state: ParticipantStateValue
	) { }

	private static create(props: {
		id: string,
		tournamentId: string,
		externalId: string,
		name: string,
		state: ParticipantStateValue,
	}) {
		return new ParticipantDTO(
			props.id,
			props.tournamentId,
			props.externalId,
			props.name,
			props.state
		);
	}

	static fromDomain(participant: Participant): ParticipantDTO {
		return ParticipantDTO.create({
			id: participant.id.value,
			tournamentId: participant.tournamentId.value,
			externalId: participant.externalId,
			name: participant.name,
			state: participant.state.value,
		});
	}
}
