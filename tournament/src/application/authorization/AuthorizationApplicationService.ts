import { AppUser } from "./AppUser";
import { HistoryAuthorizationApplicationService } from "./implements/HistoryAuthorizationApplicationService";
import { ParticipantAuthorizationApplicationService } from "./implements/ParticipantAuthorizationApplicationService";
import { TournamentAuthorizationApplicationService } from "./implements/TournamentAuthorizationApplicationService";


export class AuthorizationApplicationService {
	createTournamentPolicyUser(user: AppUser) {
		const authorizer = new TournamentAuthorizationApplicationService();
		return authorizer.createPolicyUser(user);
	}

	createParticipantPolicyUser(user: AppUser) {
		const authorizer = new ParticipantAuthorizationApplicationService();
		return authorizer.createPolicyUser(user);
	}

	createHistoryPolicyUser(user: AppUser) {
		const authorizer = new HistoryAuthorizationApplicationService();
		return authorizer.createPolicyUser(user);
	}
}
