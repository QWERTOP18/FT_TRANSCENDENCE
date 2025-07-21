import { IDIMachine } from "../interfaces/IDIMachine";


export class DIContainer {

	private static diMachine: IDIMachine;

	public static injectDIMachine(diMachine: IDIMachine) {
		this.diMachine = diMachine;
	}

	public static applicationService() {
		if (this.diMachine == undefined)
			throw new Error("DIContainer: 依存が注入されていません")
		const applicationServiceFactory = this.diMachine.applicationService();
		return applicationServiceFactory();
	}

	public static battleService() {
		if (this.diMachine == undefined)
			throw new Error("DIContainer: 依存が注入されていません")
		const battleServiceFactory = this.diMachine.battleService();
		return battleServiceFactory();
	}
}
