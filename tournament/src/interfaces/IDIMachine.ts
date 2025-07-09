import { TournamentApplicationService } from "../application/TournamentApplicationServiceFacade";


export interface IDIMachine {
	applicationService: () => () => TournamentApplicationService;
}
