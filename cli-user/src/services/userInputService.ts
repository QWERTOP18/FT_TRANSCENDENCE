import * as readline from 'readline';

export class UserInputService {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
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
