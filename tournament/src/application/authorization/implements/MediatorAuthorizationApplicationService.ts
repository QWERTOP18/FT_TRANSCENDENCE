import { Authorizer } from "../../../libs/authorization/src/Authorizer";
import { RuleSet } from "../../../libs/authorization/src/RuleSet";
import { AppMediator } from "../actors/AppMediator";
import { CheckMediator } from "../rules/CheckMediator";

const MediatorAuthorizationRules = {
	anything: (user: AppMediator, resource: any) => {
		return CheckMediator.execute(user)
	},
} satisfies RuleSet<AppMediator, any>;

export class MediatorAuthorizationApplicationService extends Authorizer<typeof MediatorAuthorizationRules> {
	constructor() {
		super(MediatorAuthorizationRules);
	}
}
