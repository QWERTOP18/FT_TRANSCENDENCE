import { TournamentParticipant } from "../api-wrapper/tournament/TournamentAPI";

export class ParticipantsService {
	async alreadyJoinedTournament(participants: TournamentParticipant[], userId: string): Promise<boolean> {
		return participants.some(participant => participant.external_id === userId);
	}
}
