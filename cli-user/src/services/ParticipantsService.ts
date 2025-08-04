import { TournamentParticipant } from "../api-wrapper/tournament/TournamentAPI";

export class ParticipantsService {
	alreadyJoinedTournament(participants: TournamentParticipant[], userId: string): boolean {
		const participant = participants.find(participant => participant.external_id === userId);
		if (participant) {
			return true;
		}
		return false;
	}

	alreadyReadyForBattle(participants: TournamentParticipant[], userId: string): boolean {
		const participant = participants.find(participant => participant.external_id === userId);
		if (participant) {
			return participant.state === 'ready';
		}
		return false;
	}

	getParticipantById(participants: TournamentParticipant[], userId: string): TournamentParticipant | undefined {
		return participants.find(participant => participant.external_id === userId);
	}

}
