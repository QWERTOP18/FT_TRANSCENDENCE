import { Rule } from "./Rule";


export type RuleSet<User, Resource> = {
	[action: string]: Rule<User, Resource>;
};
