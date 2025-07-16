import { Participant } from "../../../domain/tournament/entities/Participant";
import { AppUser } from "../AppUser";


export class CheckParticipant {
	public static execute(user: AppUser, participant: Participant) {
		return user.externalId == participant.externalId;
	}
}
