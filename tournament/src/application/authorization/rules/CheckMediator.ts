import { AppMediator } from "../actors/AppMediator";


export class CheckMediator {
	public static execute(user: AppMediator) {
		// TODO: This is worst method.
		return user.mediatorToken == 'ft_transcendence';
	}
}
