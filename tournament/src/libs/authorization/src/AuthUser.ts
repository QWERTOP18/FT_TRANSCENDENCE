import { Authorizer } from "./Authorizer";
import { RuleSet } from "./RuleSet";

// AuthUser クラス定義
export class AuthUser<Rules extends RuleSet<any, any>> {
	constructor(
		private user: Parameters<Rules[keyof Rules]>[0],
		private authorizer: Authorizer<Rules>
	) { }

	can<Action extends keyof Rules>(
		action: Action,
		resource: Parameters<Rules[Action]>[1]
	): boolean {
		return this.authorizer.can(this.user, action, resource);
	}
}
