import { Tournament } from '../api-wrapper/tournament/TournamentAPI';
import { PrintTournamentListCommand } from '../commands/PrintTournamentList';
import { UserInputService } from './userInputService';

export class MenuService {
  constructor() {
  }

  async showMainMenu(): Promise<'1' | '2' | '3'> {
    console.log('\n=== Main Menu ===');
    console.log('1. Play against AI');
    console.log('2. View Tournaments');
    console.log('3. Exit');

    const validChoices = ['1', '2', '3'];
    const validate = (choice: string): choice is '1' | '2' | '3' => {
      return validChoices.includes(choice.trim());
    }
    while (true) {
      const userInputService = UserInputService.getInstance();
      const choice = await userInputService.askQuestion('Select an option (1-3): ');
      const trimmedChoice = choice.trim();
      if (validate(trimmedChoice)) {
        return trimmedChoice;
      }
    }
  }

  async selectTournamentMenu(tournaments: Tournament[]): Promise<string | null> {
    new PrintTournamentListCommand(tournaments).execute();

    const userInputService = UserInputService.getInstance();
    const choice = await userInputService.askQuestion(`Select a tournament (1-${tournaments.length}) or 'b' to go back: `);
    const trimmedChoice = choice.trim().toLowerCase();

    if (trimmedChoice === 'b' || trimmedChoice === 'back') {
      return null;
    }

    const tournamentIndex = parseInt(trimmedChoice) - 1;
    if (tournamentIndex >= 0 && tournamentIndex < tournaments.length) {
      return tournaments[tournamentIndex].id;
    }

    console.log('Invalid selection. Please try again.');
    return await this.selectTournamentMenu(tournaments);
  }

  async showTournamentDetailsMenu(tournament: Tournament): Promise<'join' | 'ready' | 'back'> {

    console.log('\n=== Tournament Details ===');
    console.log(`Name: ${tournament.name}`);
    console.log(`Status: ${tournament.state}`);
    console.log(`Participants: ${tournament.participants}/${tournament.max_num}`);
    console.log('==========================');

    console.log('\n1. Join Tournament');
    console.log('2. Ready to Play');
    console.log('3. Back to Tournaments');

    while (true) {
      const userInputService = UserInputService.getInstance();
      const choice = await userInputService.askQuestion(`Select a tournament (1-3) or \'b\' to go back: `);
      if (choice === '1') {
        return 'join';
      } else if (choice === '2') {
        return 'ready';
      } else if (choice === '3' || choice.toLowerCase() === 'b' || choice.toLowerCase() === 'back') {
        return 'back';
      }
      console.log('Invalid selection. Please try again.');
    }
  }
} 
