import * as readline from 'readline';

export class UserInputService {

  static instance: UserInputService | null = null;

  private rl: readline.Interface;

  private constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.on('SIGINT', () => {
      process.kill(process.pid, 'SIGINT');
    });
  }

  static getInstance() {
    if (!UserInputService.instance) {
      UserInputService.instance = new UserInputService();
    }
    return UserInputService.instance;
  }

  async pause(): Promise<void> {
    await this.askQuestion('Please enter...');
    return;
  }

  async askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async askUserName(): Promise<string> {
    console.log('\n=== Welcome to Pong Game ===');
    console.log('Please enter your username to start playing.');

    let userName: string;
    do {
      userName = await this.askQuestion('Enter your username: ');
      if (!userName) {
        console.log('Username cannot be empty. Please try again.');
      }
    } while (!userName);

    return userName;
  }

  async askForNewUser(): Promise<boolean> {
    const answer = await this.askQuestion('User not found. Would you like to create a new account? (y/n): ');
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  }

  close(): void {
    this.rl.close();
  }
} 
