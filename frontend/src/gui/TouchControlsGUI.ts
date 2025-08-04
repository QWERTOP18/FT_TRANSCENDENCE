import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, StackPanel } from "@babylonjs/gui";

/**
 * タッチ操作用のGUIクラス
 */
export class TouchControlsGUI {
	private advancedTexture: AdvancedDynamicTexture;
	private leftButton!: Button;
	private rightButton!: Button;
	private controlPanel!: StackPanel;

	constructor(scene: Scene) {
		this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("TouchControlsUI", true, scene);
		this.createTouchControls();
	}

	/**
	 * タッチ操作UIを作成
	 */
	private createTouchControls() {
		// メインのコントロールパネル
		this.controlPanel = new StackPanel();
		this.controlPanel.isVertical = false;
		this.controlPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		this.controlPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		this.controlPanel.width = "400px";
		this.controlPanel.height = "120px";
		this.controlPanel.top = "20px"; // canvasの下に配置
		this.advancedTexture.addControl(this.controlPanel);

		// 左ボタン
		this.leftButton = Button.CreateSimpleButton("leftButton", "←");
		this.leftButton.width = "150px";
		this.leftButton.height = "100px";
		this.leftButton.fontSize = "48px";
		this.leftButton.color = "white";
		this.leftButton.background = "linear-gradient(145deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(59, 130, 246, 0.4) 100%)";
		this.leftButton.cornerRadius = 20;
		this.leftButton.thickness = 2;
		this.leftButton.fontFamily = "Exo, sans-serif";
		this.leftButton.fontWeight = "bold";
		this.controlPanel.addControl(this.leftButton);

		// 右ボタン
		this.rightButton = Button.CreateSimpleButton("rightButton", "→");
		this.rightButton.width = "150px";
		this.rightButton.height = "100px";
		this.rightButton.fontSize = "48px";
		this.rightButton.color = "white";
		this.rightButton.background = "linear-gradient(145deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(59, 130, 246, 0.4) 100%)";
		this.rightButton.cornerRadius = 20;
		this.rightButton.thickness = 2;
		this.rightButton.fontFamily = "Exo, sans-serif";
		this.rightButton.fontWeight = "bold";
		this.controlPanel.addControl(this.rightButton);

		// ボタンのイベントリスナーを設定
		this.setupButtonEvents();
	}

	/**
	 * ボタンのイベントリスナーを設定
	 */
	private setupButtonEvents() {
		// 左ボタンのイベント
		this.leftButton.onPointerDownObservable.add(() => {
			this.onLeftButtonDown();
		});

		this.leftButton.onPointerUpObservable.add(() => {
			this.onLeftButtonUp();
		});

		this.leftButton.onPointerOutObservable.add(() => {
			this.onLeftButtonUp();
		});

		// 右ボタンのイベント
		this.rightButton.onPointerDownObservable.add(() => {
			this.onRightButtonDown();
		});

		this.rightButton.onPointerUpObservable.add(() => {
			this.onRightButtonUp();
		});

		this.rightButton.onPointerOutObservable.add(() => {
			this.onRightButtonUp();
		});
	}

	/**
	 * 左ボタン押下時のコールバック
	 */
	private onLeftButtonDown() {
		if (this.onMoveLeft) {
			this.onMoveLeft(true);
		}
	}

	/**
	 * 左ボタン離上時のコールバック
	 */
	private onLeftButtonUp() {
		if (this.onMoveLeft) {
			this.onMoveLeft(false);
		}
	}

	/**
	 * 右ボタン押下時のコールバック
	 */
	private onRightButtonDown() {
		if (this.onMoveRight) {
			this.onMoveRight(true);
		}
	}

	/**
	 * 右ボタン離上時のコールバック
	 */
	private onRightButtonUp() {
		if (this.onMoveRight) {
			this.onMoveRight(false);
		}
	}

	/**
	 * 移動コールバック
	 */
	public onMoveLeft: ((isPressed: boolean) => void) | null = null;
	public onMoveRight: ((isPressed: boolean) => void) | null = null;

	/**
	 * タッチコントロールを表示
	 */
	public show() {
		this.controlPanel.isVisible = true;
	}

	/**
	 * タッチコントロールを非表示
	 */
	public hide() {
		this.controlPanel.isVisible = false;
	}

	/**
	 * タッチコントロールを破棄
	 */
	public dispose() {
		this.advancedTexture.dispose();
	}

	/**
	 * 静的ファクトリーメソッド
	 */
	public static async createTouchControlsGUI(scene: Scene): Promise<TouchControlsGUI> {
		return new TouchControlsGUI(scene);
	}
} 
