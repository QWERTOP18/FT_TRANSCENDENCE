import { BattleApplicationService } from "../../application/service/battle/BattleApplicationService";
import { TournamentApplicationService } from "../../application/service/tournament/TournamentApplicationServiceFacade";


export interface IDIMachine {
	applicationService: () => () => TournamentApplicationService;
	battleService: () => () => BattleApplicationService;
}
