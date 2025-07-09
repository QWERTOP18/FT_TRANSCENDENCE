import { DIContainer } from './DIContainer';
import { DITournamentMachine } from './DITournamentMachine';
import { runApiServer } from './presentation/api';

(async () => {
  DIContainer.injectDIMachine(new DITournamentMachine());
  await runApiServer()
})()
