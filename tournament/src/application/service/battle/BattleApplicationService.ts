import { IRepositoryFactory } from "../../../domain/interfaces/IRepositoryFactory";
import { CancelBattleParticipantApplicationService, CancelBattleParticipantApplicationServiceCommand } from "./implements/CancelBattleApplicationService";
import { StartBattleParticipantApplicationService, StartBattleParticipantApplicationServiceCommand } from "./implements/StartBattleApplicationService";


export type BattleApplicationServiceProps = {
	readonly repositoryFactory: IRepositoryFactory,
}

export class BattleApplicationServiceFacade {
	constructor(private props: BattleApplicationServiceProps) { }

	async startBattle(command: StartBattleParticipantApplicationServiceCommand) {
		const service = new StartBattleParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}

	async cancelBattle(command: CancelBattleParticipantApplicationServiceCommand) {
		const service = new CancelBattleParticipantApplicationService(this.props.repositoryFactory);
		return await service.execute(command);
	}
}
