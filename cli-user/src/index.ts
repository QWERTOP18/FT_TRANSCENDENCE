import { User } from './api-wrapper/auth/auth';
import { MainMenuService } from './main/MainMenuService';
import { AuthenticateService } from './services/AutehnticateService';
import { UserInputService } from './services/userInputService';

async function main(): Promise<void> {
  try {
    const userInputService = UserInputService.getInstance();

    const user: User = await new AuthenticateService().authenticateUser();
    console.log(`User ID: ${user.id}`);
    await new MainMenuService().showMainMenu();
    console.log('Goodbye!');
    userInputService.close();
    process.exit(0);
  } catch (error) {
    console.error('Application failed:', error);
    process.exit(1);
  }
}

// Run the application
main(); 
