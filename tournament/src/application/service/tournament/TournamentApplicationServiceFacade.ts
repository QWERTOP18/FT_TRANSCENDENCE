import { IRepositoryFactory } from "../../../domain/interfaces/IRepositoryFactory";
import { CreateTournamentApplicationService, CreateTournamentApplicationServiceCommand } from "./implements/CreateTournamentApplicationService";
import { GetAllTournamentApplicationService, GetAllTournamentApplicationServiceCommand } from "./implements/GetAllTournamentApplicationService";
import { GetTournamentApplicationService, GetTournamentApplicationServiceCommand } from "./implements/GetTournamentApplicationService";
import { GetTournamentHistoriesApplicationService, GetTournamentHistoriesApplicationServiceCommand } from "./implements/GetTournamentHistoriesApplicationService";
import { GetTournamentParticipantsApplicationService, GetTournamentParticipantsApplicationServiceCommand } from "./implements/GetTournamentParticipantsApplicationService";
import { OpenTournamentApplicationService, OpenTournamentApplicationServiceCommand } from "./implements/OpenTournamentApplicationService";


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

	async getHistories(command: GetTournamentHistoriesApplicationServiceCommand) {
		const service = new GetTournamentHistoriesApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}

	async getParticipants(command: GetTournamentParticipantsApplicationServiceCommand) {
		const service = new GetTournamentParticipantsApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}

	async openTournament(command: OpenTournamentApplicationServiceCommand) {
		const service = new OpenTournamentApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
