import { BattleApplicationServiceFacade } from "../../application/service/battle/BattleApplicationService";
import { TournamentApplicationService } from "../../application/service/tournament/TournamentApplicationServiceFacade";
import { PrismaClientProvider } from "../../infrastructure/Prisma/PrismaClientProvider";
import { PrismaRepositoryFactory } from "../../infrastructure/Prisma/PrismaReopsitoryFactory";
import { IDIMachine } from "../interfaces/IDIMachine";


export class DITournamentMachine implements IDIMachine {

	applicationService() {
		return () => {
			return new TournamentApplicationService({
				repositoryFactory: new PrismaRepositoryFactory(new PrismaClientProvider())
			});
		}
	}

	battleService() {
		return () => {
			return new BattleApplicationServiceFacade({
				repositoryFactory: new PrismaRepositoryFactory(new PrismaClientProvider())
			});
		}
	}
}
