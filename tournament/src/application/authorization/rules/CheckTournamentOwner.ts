import { Tournament } from "../../../domain/tournament/aggregate/Tournament";
import { AppUser } from "../actors/AppUser";


export class CheckTournamentOwner {
	public static execute(tournament: Tournament, user: AppUser) {
		const owner = tournament.getOwner();
		return owner.externalId == user.externalId;
	}
}
