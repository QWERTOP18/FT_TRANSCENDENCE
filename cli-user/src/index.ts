import { User } from './api-wrapper/auth/auth';
import { BattleAPI } from './api-wrapper/battle/BattleAPI';
import { BattleError } from './api-wrapper/battle/BattleError';
import { Tournament, TournamentAPI } from './api-wrapper/tournament/TournamentAPI';
import { TournamentError } from './api-wrapper/tournament/TournamentError';
import { GameService } from './services/gameService';
import { MenuService } from './services/menuService';
import { UserInputService } from './services/userInputService';
import { UserService } from './services/userService';

async function main(): Promise<void> {
  try {
    const userService = new UserService();
    const battleService = new BattleAPI();
    const gameService = new GameService();

    // ユーザー認証
    const user: User = await userService.authenticateUser();
    console.log(`User ID: ${user.id}`);

    // UserServiceのUserInputServiceインスタンスを取得してMenuServiceと共有
    const userInputService = userService.userInputService;
    const menuService = new MenuService(userInputService);

    // メインメニューを表示
    await showMainMenuLoop(user, battleService, gameService, menuService, userInputService);

  } catch (error) {
    console.error('Application failed:', error);
    process.exit(1);
  }
}

async function showMainMenuLoop(
  user: User,
  battleService: BattleAPI,
  gameService: GameService,
  menuService: MenuService,
  userInputService: UserInputService
): Promise<void> {
  while (true) {
    try {
      const choice = await menuService.showMainMenu();

      switch (choice) {
        case '1':
          // AI対戦を開始
          console.log('\nStarting AI battle...');
          const resp = await battleService.startAIBattle();
          console.log("resp: ", resp);
          gameService.connectToGameWebSocket(resp.room_id, user.id);
          return; // ゲーム終了後はアプリケーションを終了

        case '2':
          // トーナメント一覧を表示
          await handleTournamentMenu(user, gameService, menuService);
          break;

        case '3':
          // アプリケーションを終了
          console.log('Goodbye!');
          menuService.close();
          userInputService.close();
          process.exit(0);

        default:
          console.log('Invalid choice. Please select 1, 2, or 3.');
      }
    } catch (error) {
      console.error('Menu error:', error);
      console.log('Returning to main menu...');
    }
  }
}

async function handleTournamentMenu(
  user: User,
  gameService: GameService,
  menuService: MenuService
): Promise<void> {
  try {
    while (true) {
      const tournaments = await menuService.displayTournaments(user.id);
      const selectedTournamentId = await menuService.showTournamentMenu(tournaments);

      if (selectedTournamentId) {
        const tournament = tournaments.find(t => t.id == selectedTournamentId);
        if (!tournament) {
          break;
        }
        const selection = await handleTournamentDetailMenu(user, tournament, menuService);
        if (selection === 'back') {
          console.log('Exiting tournament details...');
          return;
        }
      }
      else {
        break;
      }
    }
    console.log('Returning to main menu...');
    return;
  } catch (error) {
    console.error('Tournament menu error:', error);
    console.log('Returning to main menu...');
  }
}

async function handleTournamentDetailMenu(
  user: User,
  tournament: Tournament,
  menuService: MenuService,
) {
  const selection = await menuService.showTournamentDetailsMenu(tournament);
  if (selection === 'join') {
    await handleJoinTournament(tournament.id, user.id);
  } else if (selection === 'ready') {
    await handleTournamentReady(tournament, user);
  }
  return selection;
}

async function handleJoinTournament(
  tournamentId: string,
  userId: string
): Promise<void> {
  try {
    console.log('\nJoining tournament...');
    const tournamentAPI = new TournamentAPI();
    await tournamentAPI.joinTournament(tournamentId, userId);
    console.log('Successfully joined the tournament!');
  } catch (error) {
    if (error instanceof TournamentError) {
      console.error('Error joining tournament:', error.message);
      return;
    }
    throw error;
  }
}

async function handleTournamentReady(tournament: Tournament, user: User) {
  console.log('Ready to play tournament!');
  try {
    const battleService = new BattleAPI();
    await battleService.ready(tournament.id, user.id);
    console.log('Ready signal sent successfully!');
    return;
  } catch (error) {
    if (error instanceof BattleError) {
      console.error('Can not ready: ', error.error);
      return;
    }
    throw error;
  }
}

// Run the application
main(); 
