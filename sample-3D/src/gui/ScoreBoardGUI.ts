import { Animation, EasingFunction, QuinticEase, Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Grid, TextBlock } from "@babylonjs/gui";

export class ScoreBoardGUI {

	public opponentScoreTextBlock: TextBlock;
	public playerScoreTextBlock: TextBlock;
	public grid: Grid;
	public opponentScore: number;
	public playerScore: number;
	private frameRate: number;

	constructor(public advancedTexture: AdvancedDynamicTexture) {

		const playerScoreTextBlock = this.advancedTexture.getControlByName("PlayerScore");
		const opponentScoreTextBlock = this.advancedTexture.getControlByName("OpponentScore");
		if (!opponentScoreTextBlock || !playerScoreTextBlock) {
			throw new Error("GUIのスコアテキストが見つかりません。");
		}
		if (!(opponentScoreTextBlock instanceof TextBlock)
			|| !(playerScoreTextBlock instanceof TextBlock)) {
			throw new Error("GUIのスコアテキストがTextBlockではありません。");
		}
		this.playerScoreTextBlock = playerScoreTextBlock;
		this.opponentScoreTextBlock = opponentScoreTextBlock;
		this.playerScore = 0;
		this.opponentScore = 0;
		this.setScore(this.playerScore, this.opponentScore);

		const grid = this.advancedTexture.getControlByName("ScoreBoard");
		if (!grid) {
			throw new Error("GUIのスコアボードが見つかりません。");
		}
		if (!(grid instanceof Grid)) {
			throw new Error("GUIのスコアボードがAdvancedDynamicTextureではありません。");
		}
		grid.alpha = 0;
		
		this.frameRate = 10;
		const xSlide = new Animation("xSlide", "top", this.frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

		xSlide.setKeys([
			{
				frame: 0,
				value: -100
			},
			{
				frame: this.frameRate,
				value: 0
			},
			{
				frame: 2 * this.frameRate,
				value: -100
			}
		]);
		
		const alpha = new Animation("alpha", "alpha", this.frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
		alpha.setKeys([
			{
				frame: 0,
				value: 0
			},
			{
				frame: this.frameRate,
				value: 1
			},
			{
				frame: 2 * this.frameRate,
				value: 0
			}
		]);
		const easingFunction = new QuinticEase();
		easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
		xSlide.setEasingFunction(easingFunction);
		alpha.setEasingFunction(easingFunction);

		grid.animations = [xSlide, alpha];
		this.grid = grid;
	}

	public setScore(playerScore: number, opponentScore: number) {
		this.playerScore = playerScore;
		this.opponentScore = opponentScore;
		this.playerScoreTextBlock.text = playerScore.toString();
		this.opponentScoreTextBlock.text = opponentScore.toString();
	}

	public static async createScoreBoardGUI(scene: Scene) {
		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);

		const loadedGUI = await advancedTexture.parseFromURLAsync("/ScoreBoard.json");
		return new ScoreBoardGUI(loadedGUI);
	}

	public async animateScore(scene: Scene) {
		scene.beginAnimation(this.grid, 0, 2 * this.frameRate, false);
	}
}
