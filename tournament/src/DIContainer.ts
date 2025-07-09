import { TournamentApplicationService } from "./application/TournamentApplicationServiceFacade";
import { IDIMachine } from "./interfaces/IDIMachine";


export class DIContainer {

	private static _applicationService: () => TournamentApplicationService;

	public static injectDIMachine(diMachine: IDIMachine) {
		this._applicationService = diMachine.applicationService();
	}

	public static applicationService() {
		if (this._applicationService == undefined)
			throw new Error("DIContainer: 依存が注入されていません")
		return this._applicationService();
	}
}
