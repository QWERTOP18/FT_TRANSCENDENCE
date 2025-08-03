import { UserInputService } from './userInputService';
import { User } from '../api-wrapper/auth/auth';
import { AuthAPI } from '../api-wrapper/auth/AuthAPI';
import { LoginSessionService } from './LoginSessionService';

export class UserService {
  private authService: AuthAPI;
  public userInputService: UserInputService;

  constructor() {
    this.authService = new AuthAPI();
    this.userInputService = new UserInputService();
  }

  async authenticateUser(): Promise<User> {
    // ユーザー名を尋ねる
    const userName = await this.userInputService.askUserName();
    
    try {
      // まず認証を試行
      const user = await LoginSessionService.login(userName);
      console.log(`Welcome back, ${user.name}!`);
      return user;
    } catch (error) {
      // 認証に失敗した場合、新規作成を提案
      console.log(`User "${userName}" not found.`);
      const createNew = await this.userInputService.askForNewUser();
      
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
