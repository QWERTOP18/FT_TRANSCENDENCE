import { User } from "../api-wrapper/auth/auth";
import { AuthAPI } from "../api-wrapper/auth/AuthAPI";


export class LoginSessionService {

	static loginSession: LoginSessionService | null = null;

	private constructor(public user: User) {
	}

	static async login(username: string): Promise<User> {
		const api = new AuthAPI();
		const user = await api.authenticate(username);
		LoginSessionService.loginSession = new LoginSessionService(user);
		return user;
	}

	static async signup(username: string): Promise<User> {
		const api = new AuthAPI();
		const newUser = await api.signup(username);
		LoginSessionService.loginSession = new LoginSessionService(newUser);
		return newUser;
	}

	static getCurrentUser(): User {
		if (!LoginSessionService.loginSession) {
			throw new Error("No user is currently logged in.");
		}
		return LoginSessionService.loginSession.user;
	}
}
