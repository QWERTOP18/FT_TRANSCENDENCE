import { PongInputActions } from "./PongInputActions";

/**
 * アクションをキーボードイベントにマッピングするクラス
 */
export class PongInputMappers {

	constructor(private actions: PongInputActions) { }

	createKeyDownActionFactory(event: 'keydown' | 'keyup') {
		if (event === 'keydown') {
			return this.onKeyDownActionFactory();
		} else {
			return this.onKeyUpActionFactory();
		}
	}

	public onKeyDownActionFactory() {
		const keyActions: Record<string, () => void> = {
			a: () => this.actions.moveToLeftAction(),
			ArrowLeft: () => this.actions.moveToLeftAction(),
			d: () => this.actions.moveToRightAction(),
			ArrowRight: () => this.actions.moveToRightAction(),
		};
		return keyActions;
	}

	public onKeyUpActionFactory() {
		const keyActions: Record<string, () => void> = {
			a: () => this.actions.stopToLeftAction(),
			ArrowLeft: () => this.actions.stopToLeftAction(),
			d: () => this.actions.stopToRightAction(),
			ArrowRight: () => this.actions.stopToRightAction(),
		};
		return keyActions;
	}
}
