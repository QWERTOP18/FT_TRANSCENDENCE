import { PongInputMappers } from "./PongInputMappers";

/**
 * イベントハンドラーを生成するファクトリークラス
 */
export class PongInputHandlerFactory {

	constructor(private actionMappers: PongInputMappers) {}

	createEventHandler(event: 'keydown' | 'keyup') {
		const actionFactory = this.actionMappers.createKeyDownActionFactory(event);
		return (event: KeyboardEvent) => {
			const action = actionFactory[event.key];
			if (action) {
				action();
			}
		};
	}
}
