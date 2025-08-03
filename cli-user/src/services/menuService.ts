import { User } from '../api-wrapper/auth/auth';
import { Tournament, TournamentAPI } from '../api-wrapper/tournament/TournamentAPI';
import { PrintTournamentListCommand } from '../commands/PrintTournamentList';
import { LoginSessionService } from './LoginSessionService';
import { UserInputService } from './userInputService';

export class MenuService {
  private userInputService: UserInputService;
  private tournamentService: TournamentAPI;

  constructor(userInputService?: UserInputService) {
    this.userInputService = userInputService || new UserInputService();
    this.tournamentService = new TournamentAPI();
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

  async showMainMenu(): Promise<string> {
    console.log('\n=== Main Menu ===');
    console.log('1. Play against AI');
    console.log('2. View Tournaments');
    console.log('3. Exit');

    const choice = await this.userInputService.askQuestion('Select an option (1-3): ');
    return choice.trim();
  }

  async showTournamentMenu(tournaments: Tournament[]): Promise<string | null> {
    new PrintTournamentListCommand(tournaments).execute();

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

  async showTournamentDetailsMenu(tournament: Tournament): Promise<'join' | 'ready' | 'back'> {

    console.log('\n=== Tournament Details ===');
    console.log(`Name: ${tournament.name}`);
    console.log(`Status: ${tournament.status}`);
    console.log(`Participants: ${tournament.participants}/${tournament.maxParticipants}`);
    console.log(`Created: ${new Date(tournament.createdAt).toLocaleDateString()}`);
    console.log('==========================');

    console.log('\n1. Join Tournament');
    console.log('2. Ready to Play');
    console.log('3. Back to Tournaments');

    while (true) {
      const choice = await this.userInputService.askQuestion(`Select a tournament (1-3): `);
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
