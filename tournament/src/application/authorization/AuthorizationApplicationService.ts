import { AppMediator } from "./actors/AppMediator";
import { AppUser } from "./actors/AppUser";
import { HistoryAuthorizationApplicationService } from "./implements/HistoryAuthorizationApplicationService";
import { MediatorAuthorizationApplicationService } from "./implements/MediatorAuthorizationApplicationService";
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

	/** mediator will be able to do anything. */
	createPolicyMediator(mediator: AppMediator) {
		const authorizer = new MediatorAuthorizationApplicationService();
		return authorizer.createPolicyUser(mediator);
	}
}
