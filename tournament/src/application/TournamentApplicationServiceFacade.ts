import { IRepositoryFactory } from "../domain/interfaces/IRepositoryFactory";
import { CreateTournamentApplicationService, CreateTournamentApplicationServiceCommand } from "./implements/CreateTournamentApplicationService";
import { GetTournamentApplicationService, GetTournamentApplicationServiceCommand } from "./implements/GetTournamentApplicationService";


export type TournamentApplicationServiceProps = {
	readonly repositoryFactory: IRepositoryFactory,
}

export class TournamentApplicationService {
	constructor(private props: TournamentApplicationServiceProps) { }

	async createTournament(command: CreateTournamentApplicationServiceCommand) {
		const service = new CreateTournamentApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}

	async getTournament(command: GetTournamentApplicationServiceCommand) {
		const service = new GetTournamentApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
