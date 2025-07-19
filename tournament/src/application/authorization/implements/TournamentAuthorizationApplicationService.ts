import { Tournament } from "../../../domain/tournament/aggregate/Tournament";
import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppUser } from "../actors/AppUser";
import { CheckTournamentOwner } from "../rules/CheckTournamentOwner";


const TournamentAuthorizationRules = {
	create: (user: AppUser, resource: Tournament) => true,
	delete: (user: AppUser, resource: Tournament) => {
		return CheckTournamentOwner.execute(resource, user);
	},
	read: (user: AppUser, resource: Tournament) => true,
	update: (user: AppUser, resource: Tournament) => {
		return CheckTournamentOwner.execute(resource, user);
	}
} satisfies RuleSet<AppUser, Tournament>;

export class TournamentAuthorizationApplicationService extends Authorizer<typeof TournamentAuthorizationRules> {
	constructor() {
		super(TournamentAuthorizationRules);
	}
}
