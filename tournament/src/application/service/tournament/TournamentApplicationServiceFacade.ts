import { IRepositoryFactory } from "../../../domain/interfaces/IRepositoryFactory";
import { BattleTournamentParticipantApplicationService, BattleTournamentParticipantApplicationServiceCommand } from "./implements/participants/BattleTournamentParticipantApplicatioinService";
import { CancelTournamentParticipantApplicationService, CancelTournamentParticipantApplicationServiceCommand } from "./implements/participants/CancelTournamentParticipantApplicationService";
import { CreateTournamentApplicationService, CreateTournamentApplicationServiceCommand } from "./implements/tournaments/CreateTournamentApplicationService";
import { CreateTournamentHistoryApplicationService, CreateTournamentHistoryApplicationServiceCommand } from "./implements/histories/CreateTournamentHistoryApplicationService";
import { CreateTournamentParticipantServiceApplication, CreateTournamentParticipantServiceApplicationCommand } from "./implements/participants/CreateTournamentParticipantServiceApplication";
import { GetAllTournamentApplicationService, GetAllTournamentApplicationServiceCommand } from "./implements/tournaments/GetAllTournamentApplicationService";
import { GetTournamentApplicationService, GetTournamentApplicationServiceCommand } from "./implements/tournaments/GetTournamentApplicationService";
import { GetTournamentHistoriesApplicationService, GetTournamentHistoriesApplicationServiceCommand } from "./implements/histories/GetTournamentHistoriesApplicationService";
import { GetTournamentParticipantsApplicationService, GetTournamentParticipantsApplicationServiceCommand } from "./implements/participants/GetTournamentParticipantsApplicationService";
import { OpenTournamentApplicationService, OpenTournamentApplicationServiceCommand } from "./implements/tournaments/OpenTournamentApplicationService";
import { ReadyTournamentParticipantApplicationService, ReadyTournamentParticipantApplicationServiceCommand } from "./implements/participants/ReadyTournamentParticipantApplicationService";


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

	async battleParticipant(command: BattleTournamentParticipantApplicationServiceCommand) {
		const service = new BattleTournamentParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
