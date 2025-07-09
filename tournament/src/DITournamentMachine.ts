import { TournamentApplicationService } from "./application/TournamentApplicationServiceFacade";
import { PrismaClientProvider } from "./infrastructure/Prisma/PrismaClientProvider";
import { PrismaRepositoryFactory } from "./infrastructure/Prisma/PrismaReopsitoryFactory";
import { IDIMachine } from "./interfaces/IDIMachine";


export class DITournamentMachine implements IDIMachine {

	applicationService() {
		return () => {
			return new TournamentApplicationService({
				repositoryFactory: new PrismaRepositoryFactory(new PrismaClientProvider())
			});
		}
	}
}
