// 型定義

import { AuthUser } from "./AuthUser";
import { RuleSet } from "./RuleSet";


// Authorizer クラス定義
export class Authorizer<Rules extends RuleSet<any, any>> {
	constructor(private rules: Rules) { }

	createPolicyUser(user: Parameters<Rules[keyof Rules]>[0]): AuthUser<Rules> {
		return new AuthUser(user, this);
	}

	can<Action extends keyof Rules>(
		user: Parameters<Rules[Action]>[0],
		action: Action,
		resource: Parameters<Rules[Action]>[1]
	): boolean {
		const rule = this.rules[action];
		return rule(user, resource);
	}
}
