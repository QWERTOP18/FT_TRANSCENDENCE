import { ParticipantScore } from "../../domain/tournament/value-objects/ParticipantScore";


export class ParticipantScoreDTO {
	private constructor(
		public id: string,
		public score: number,
	) { }

	private static create(props: {
		id: string;
		score: number;
	}) {
		return new ParticipantScoreDTO(
			props.id,
			props.score
		);
	}

	static fromDomain(participantScore: ParticipantScore): ParticipantScoreDTO {
		return ParticipantScoreDTO.create({
			id: participantScore.id.value,
			score: participantScore.score.value
		});
	}
}
