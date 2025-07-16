import { History } from "../../../domain/tournament/entities/History";
import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppUser } from "../actors/AppUser";
import { CheckMediator } from "../rules/CheckMediator";


const HistoryAuthorizationRules = {
	create: (user: AppUser, resource: History) => false,
	delete: (user: AppUser, resource: History) => false,
	read: (user: AppUser, resource: History) => {
		return true
	},
	update: (user: AppUser, resource: History) => false,
} satisfies RuleSet<AppUser, History>;

export class HistoryAuthorizationApplicationService extends Authorizer<typeof HistoryAuthorizationRules> {
	constructor() {
		super(HistoryAuthorizationRules);
	}
}
