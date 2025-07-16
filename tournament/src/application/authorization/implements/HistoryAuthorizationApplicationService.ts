import { History } from "../../../domain/tournament/entities/History";
import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppUser } from "../AppUser";
import { CheckAdmin } from "../rules/CheckAdmin";


const HistoryAuthorizationRules = {
	create: (user: AppUser, resource: History) => {
		return CheckAdmin.execute(user)
	},
	delete: (user: AppUser, resource: History) => {
		return CheckAdmin.execute(user)
	},
	read: (user: AppUser, resource: History) => {
		return true
	},
	update: (user: AppUser, resource: History) => {
		return CheckAdmin.execute(user)
	},
} satisfies RuleSet<AppUser, History>;

export class HistoryAuthorizationApplicationService extends Authorizer<typeof HistoryAuthorizationRules> {
	constructor() {
		super(HistoryAuthorizationRules);
	}
}
