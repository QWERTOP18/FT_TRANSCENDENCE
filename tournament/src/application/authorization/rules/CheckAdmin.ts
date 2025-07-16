import { AppUser } from "../AppUser";


export class CheckAdmin {
	public static execute(user: AppUser) {
		// TODO: This is worst method.
		return user.adminToken == 'ft_transcendence';
	}
}
