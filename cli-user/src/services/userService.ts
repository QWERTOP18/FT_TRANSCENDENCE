import { AuthService } from './authService';
import { UserInputService } from './userInputService';
import { User } from '../types/auth';

export class UserService {
  private authService: AuthService;
  private userInputService: UserInputService;

  constructor() {
    this.authService = new AuthService();
    this.userInputService = new UserInputService();
  }

  async authenticateUser(): Promise<User> {
    try {
      // ユーザー名を尋ねる
      const userName = await this.userInputService.askUserName();
      
      try {
        // まず認証を試行
        const user = await this.authService.authenticate(userName);
        console.log(`Welcome back, ${user.name}!`);
        return user;
      } catch (error) {
        // 認証に失敗した場合、新規作成を提案
        console.log(`User "${userName}" not found.`);
        const createNew = await this.userInputService.askForNewUser();
        
        if (createNew) {
          const newUser = await this.authService.signup(userName);
          console.log(`Welcome, ${newUser.name}! Your account has been created.`);
          return newUser;
        } else {
          console.log('Goodbye!');
          process.exit(0);
        }
      }
    } finally {
      this.userInputService.close();
    }
  }
} 
