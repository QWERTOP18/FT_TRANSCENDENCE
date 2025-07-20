import { Participant } from "../../../domain/tournament/entities/Participant";
import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppUser } from "../actors/AppUser";
import { CheckParticipant } from "../rules/CheckParticipant";

const ParticipantAuthorizationRules = {
	create: (user: AppUser, resource: Participant) => true,
	delete: (user: AppUser, resource: Participant) => {
		return CheckParticipant.execute(user, resource);
	},
	read: (user: AppUser, resource: Participant) => {
		return true
	},
	update: (user: AppUser, resource: Participant) => {
		return (
			CheckParticipant.execute(user, resource)
		);
	},
} satisfies RuleSet<AppUser, Participant>;

export class ParticipantAuthorizationApplicationService extends Authorizer<typeof ParticipantAuthorizationRules> {
	constructor() {
		super(ParticipantAuthorizationRules);
	}
}
