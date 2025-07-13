import { Tournament } from "../../domain/tournament/aggregate/Tournament";
import { TournamentStateValue } from "../../domain/tournament/value-objects/TournamentState";
import { HistoryDTO } from "./HistoryDTO";
import { ParticipantDTO } from "./ParticipantDTO";

export class TournamentDTO {

	private constructor(
		public id: string,
		public ownerId: string,
		public championId: string | undefined,
		public name: string,
		public description: string,
		public max_num: number,
		public state: TournamentStateValue,
		public participants: ParticipantDTO[],
		public histories: HistoryDTO[]
	) { }

	private static create(props: {
		id: string,
		ownerId: string,
		championId?: string,
		name: string,
		description: string,
		max_num: number,
		state: TournamentStateValue,
		participants: ParticipantDTO[],
		histories: HistoryDTO[]
	}) {
		return new TournamentDTO(
			props.id,
			props.ownerId,
			props.championId,
			props.name,
			props.description,
			props.max_num,
			props.state,
			props.participants,
			props.histories
		)
	}

	static fromDomain(tournament: Tournament): TournamentDTO {
		return TournamentDTO.create({
			id: tournament.id.value,
			ownerId: tournament.ownerId.value,
			championId: tournament.championId?.value,
			name: tournament.name,
			description: tournament.description,
			max_num: tournament.max_num,
			state: tournament.state.value,
			participants: tournament.participants
				.map(participant => ParticipantDTO.fromDomain(participant)),
			histories: tournament.histories
				.map(history => HistoryDTO.fromDomain(history)),
		});
	}
}
