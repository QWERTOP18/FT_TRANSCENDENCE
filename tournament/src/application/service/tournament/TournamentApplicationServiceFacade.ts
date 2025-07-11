import { IRepositoryFactory } from "../../../domain/interfaces/IRepositoryFactory";
import { CancelTournamentParticipantApplicationService, CancelTournamentParticipantApplicationServiceCommand } from "./implements/CancelTournamentParticipantApplicationService";
import { CreateTournamentApplicationService, CreateTournamentApplicationServiceCommand } from "./implements/CreateTournamentApplicationService";
import { CreateTournamentHistoryApplicationService, CreateTournamentHistoryApplicationServiceCommand } from "./implements/CreateTournamentHistoryApplicationService";
import { CreateTournamentParticipantServiceApplication, CreateTournamentParticipantServiceApplicationCommand } from "./implements/CreateTournamentParticipantServiceApplication";
import { GetAllTournamentApplicationService, GetAllTournamentApplicationServiceCommand } from "./implements/GetAllTournamentApplicationService";
import { GetTournamentApplicationService, GetTournamentApplicationServiceCommand } from "./implements/GetTournamentApplicationService";
import { GetTournamentHistoriesApplicationService, GetTournamentHistoriesApplicationServiceCommand } from "./implements/GetTournamentHistoriesApplicationService";
import { GetTournamentParticipantsApplicationService, GetTournamentParticipantsApplicationServiceCommand } from "./implements/GetTournamentParticipantsApplicationService";
import { OpenTournamentApplicationService, OpenTournamentApplicationServiceCommand } from "./implements/OpenTournamentApplicationService";
import { ReadyTournamentParticipantApplicationService, ReadyTournamentParticipantApplicationServiceCommand } from "./implements/ReadyTournamentParticipantApplicationService";


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

	async createHistory(command: CreateTournamentHistoryApplicationServiceCommand) {
		const service = new CreateTournamentHistoryApplicationService(this.props.repositoryFactory)
		return await service.execute(command);
	}

	async createParticipant(command: CreateTournamentParticipantServiceApplicationCommand) {
		const service = new CreateTournamentParticipantServiceApplication(this.props.repositoryFactory)
		return await service.execute(command);
	}

	async readyParticipant(command: ReadyTournamentParticipantApplicationServiceCommand) {
		const service = new ReadyTournamentParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}

	async cancelParticipant(command: CancelTournamentParticipantApplicationServiceCommand) {
		const service = new CancelTournamentParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
