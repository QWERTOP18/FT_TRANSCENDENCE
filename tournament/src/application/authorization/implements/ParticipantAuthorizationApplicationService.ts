import { Tournament } from "../../../domain/tournament/aggregate/Tournament";
import { Participant } from "../../../domain/tournament/entities/Participant";
import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppUser } from "../AppUser";
import { CheckParticipant } from "../rules/CheckParticipant";
import { CheckTournamentOwner } from "../rules/CheckTournamentOwner";

const ParticipantAuthorizationRules = {
	create: (user: AppUser, resource: Tournament) => {
		return CheckTournamentOwner.execute(resource, user);
	},
	delete: (user: AppUser, resource: Tournament) => {
		return CheckTournamentOwner.execute(resource, user);
	},
	read: (user: AppUser, resource: Participant) => {
		return true
	},
	update: (user: AppUser, resource: Participant) => {
		return CheckParticipant.execute(user, resource);
	},
} satisfies RuleSet<AppUser, Participant>;

export class ParticipantAuthorizationApplicationService extends Authorizer<typeof ParticipantAuthorizationRules> {
	constructor() {
		super(ParticipantAuthorizationRules);
	}
}
