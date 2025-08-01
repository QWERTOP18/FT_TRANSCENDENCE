import { UserInputService } from './userInputService';
import { TournamentService, Tournament } from './tournamentService';
import { ErrorResponse } from '../errors/JoinErrorResponse';

export class MenuService {
  private userInputService: UserInputService;
  private tournamentService: TournamentService;

  constructor(userInputService?: UserInputService) {
    this.userInputService = userInputService || new UserInputService();
    this.tournamentService = new TournamentService();
  }

  async showMainMenu(): Promise<string> {
    console.log('\n=== Main Menu ===');
    console.log('1. Play against AI');
    console.log('2. View Tournaments');
    console.log('3. Exit');
    
    const choice = await this.userInputService.askQuestion('Select an option (1-3): ');
    return choice.trim();
  }

  async showTournamentMenu(tournaments: Tournament[]): Promise<string | null> {
    if (tournaments.length === 0) {
      console.log('\nNo tournaments available.');
      return null;
    }

    console.log('\n=== Available Tournaments ===');
    tournaments.forEach((tournament, index) => {
      console.log(`${index + 1}. ${tournament.name}`);
      console.log(`   Status: ${tournament.status}`);
      console.log(`   Participants: ${tournament.participants}/${tournament.maxParticipants}`);
      console.log(`   Created: ${new Date(tournament.createdAt).toLocaleDateString()}`);
      console.log('');
    });

    const choice = await this.userInputService.askQuestion(`Select a tournament (1-${tournaments.length}) or 'b' to go back: `);
    const trimmedChoice = choice.trim().toLowerCase();

    if (trimmedChoice === 'b' || trimmedChoice === 'back') {
      return null;
    }

    const tournamentIndex = parseInt(trimmedChoice) - 1;
    if (tournamentIndex >= 0 && tournamentIndex < tournaments.length) {
      return tournaments[tournamentIndex].id;
    }

    console.log('Invalid selection. Please try again.');
    return await this.showTournamentMenu(tournaments);
  }

  async showTournamentDetailsMenu(tournament: Tournament): Promise<'join' | 'ready' | 'exit'> {

    console.log('\n=== Tournament Details ===');
    console.log(`Name: ${tournament.name}`);
    console.log(`Status: ${tournament.status}`);
    console.log(`Participants: ${tournament.participants}/${tournament.maxParticipants}`);
    console.log(`Created: ${new Date(tournament.createdAt).toLocaleDateString()}`);
    console.log('==========================');

    console.log('1. Join Tournament');
    console.log('2. Ready to Play');
    console.log('3. Back to Tournaments');

    
    while (true) {
      const choice = await this.userInputService.askQuestion(`Select a tournament (1-3): `);
      if (choice === '1') {
        return 'join';
      } else if (choice === '2') {
        return 'ready';
      } else if (choice === '3' || choice.toLowerCase() === 'b' || choice.toLowerCase() === 'back') {
        return 'exit';
      }
      console.log('Invalid selection. Please try again.');
    }
  }

  async displayTournaments(userId: string): Promise<Tournament[]> {
    try {
      const tournaments = await this.tournamentService.getTournaments(userId);
      return tournaments;
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      return [];
    }
  }

  async joinSelectedTournament(tournamentId: string, userId: string) {
    try {
      const resp = await this.tournamentService.joinTournament(tournamentId, userId);
      return resp;
    } catch (error) {
      console.error('Failed to join tournament:', error);
      throw error;
    }
  }

  close(): void {
    this.userInputService.close();
  }
} 
