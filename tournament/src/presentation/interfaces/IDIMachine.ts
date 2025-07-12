import { TournamentApplicationService } from "../../application/service/tournament/TournamentApplicationServiceFacade";


export interface IDIMachine {
	applicationService: () => () => TournamentApplicationService;
}
