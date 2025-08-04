import { User } from "../api-wrapper/auth/auth";
import { LoginSessionService } from "./LoginSessionService";
import { UserInputService } from "./userInputService";


export class AuthenticateService {

  async authenticateUser(): Promise<User> {
	const userInputService = UserInputService.getInstance();
	const userName = await userInputService.askUserName();

	try {
	  const user = await LoginSessionService.login(userName);
	  console.log(`Welcome back, ${user.name}!`);
	  return user;
	} catch (error) {
	  console.log(`User "${userName}" not found.`);
	  const createNew = await userInputService.askForNewUser();

	  if (createNew) {
		const newUser = await LoginSessionService.signup(userName);
		console.log(`Welcome, ${newUser.name}! Your account has been created.`);
		return newUser;
	  } else {
		console.log('Goodbye!');
		process.exit(0);
	  }
	}
  }
}
