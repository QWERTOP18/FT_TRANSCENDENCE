import { History } from "../../domain/tournament/entities/History";
import { ParticipantScoreDTO } from "./ParticipantScoreDTO";


export class HistoryDTO {
	private constructor(
		public id: string,
		public tournamentId: string,
		public winner: ParticipantScoreDTO,
		public loser: ParticipantScoreDTO,
		public created_at: Date,
	) { }

	private static create(props: {
		id: string,
		tournamentId: string,
		winner: ParticipantScoreDTO,
		loser: ParticipantScoreDTO,
		created_at: Date,
	}) {
		return new HistoryDTO(
			props.id,
			props.tournamentId,
			props.winner,
			props.loser,
			props.created_at
		);
	}

	static fromDomain(history: History): HistoryDTO {
		return HistoryDTO.create({
			id: history.id.value,
			tournamentId: history.tournamentId.value,
			winner: ParticipantScoreDTO.fromDomain(history.winner),
			loser: ParticipantScoreDTO.fromDomain(history.loser),
			created_at: history.created_at
		});
	}
}
