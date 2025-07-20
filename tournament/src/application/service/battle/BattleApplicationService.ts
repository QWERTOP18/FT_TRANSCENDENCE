import { IRepositoryFactory } from "../../../domain/interfaces/IRepositoryFactory";
import { StartBattleParticipantApplicationService, StartBattleParticipantApplicationServiceCommand } from "./implements/StartBattleApplicationService";


export type BattleApplicationServiceProps = {
	readonly repositoryFactory: IRepositoryFactory,
}

export class BattleApplicationService {
	constructor(private props: BattleApplicationServiceProps) { }

	async startBattle(command: StartBattleParticipantApplicationServiceCommand) {
		const service = new StartBattleParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
