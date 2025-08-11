

// 渡されたオブジェクトが変更されていた場合通知する。
export class StateReloader {
	
	static instance: StateReloader | null = null;

	updater: () => any;
	onUpdate: (newState: any) => void;
	oldJson: string;
	oldValue: object;
	interval: number;
	intervalId: ReturnType<typeof setInterval> | null;

	private constructor(props: {
		initialValue: object,
		updater: () => any,
		onUpdate: (newState: any) => void
		interval: number,
	}) {
		this.updater = props.updater;
		this.onUpdate = props.onUpdate;
		this.oldValue = props.initialValue;
		this.oldJson = JSON.stringify(this.oldValue);
		this.interval = props.interval;
		this.intervalId = null;
		this.intervalId = this.startInterval();
	}

	// インターバルを開始する
	startInterval() {
		this.stopInterval();
		return setInterval(async () => {
			const newValue = await this.updater();
			const newJson = JSON.stringify(newValue);
			const oldJson = this.oldJson;
			if (newJson != oldJson) {
				this.onUpdate(newValue);
				this.oldValue = newValue;
				this.oldJson = newJson;
			}
		}, this.interval);
	}

	// インターバルを停止する
	stopInterval() {
		if (this.intervalId != null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * インスタンスを生成する
	 * @param props 
	 * @param props.initialValue 初期値
	 * @param props.updater 更新関数
	 * @param props.onUpdate 更新時のコールバック newState - 新しい状態 Note: この時点でインスタンスの元の状態は更新されないです。
	 * @param props.interval インターバル時間（ミリ秒）
	 * @returns 
	 */
	static create<T extends object> (props: {
		initialValue: T,
		updater: () => T,
		onUpdate: (newState: T) => void,
		interval?: number
	}) {
		props.interval ??= 1000;
		StateReloader.clearInstance();
		StateReloader.instance = new StateReloader({
			initialValue: props.initialValue,
			updater: props.updater,
			onUpdate: props.onUpdate,
			interval: props.interval
		});
		return StateReloader.instance;
	}

	// インスタンスをクリアする
	static clearInstance() {
		StateReloader.instance?.stopInterval();
		StateReloader.instance = null;
	}
}
