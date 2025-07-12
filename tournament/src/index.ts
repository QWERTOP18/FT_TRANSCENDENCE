import { DIContainer } from './presentation/classes/DIContainer';
import { DITournamentMachine } from './presentation/classes/DITournamentMachine';
import { runApiServer } from './presentation/api';

(async () => {
  DIContainer.injectDIMachine(new DITournamentMachine());
  await runApiServer()
})()
