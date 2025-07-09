import { IRepositoryFactory } from "../domain/interfaces/IRepositoryFactory";
import { CreateTournamentApplicationService, CreateTournamentApplicationServiceCommand } from "./implements/CreateTournamentApplicationService";
import { GetAllTournamentApplicationService, GetAllTournamentApplicationServiceCommand } from "./implements/GetAllTournamentApplicationService";
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

	async getAllTournament(command: GetAllTournamentApplicationServiceCommand) {
		const service = new GetAllTournamentApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
