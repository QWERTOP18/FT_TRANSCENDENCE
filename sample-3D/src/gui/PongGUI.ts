import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

export class PongGUI {

    public opponentScoreTextBlock: TextBlock;
    public playerScoreTextBlock: TextBlock;
    public opponentScore: number;
    public playerScore: number;

    constructor(public advancedTexture: AdvancedDynamicTexture) {
        
        const opponentScoreTextBlock = this.advancedTexture.getControlByName("opponent-score");
        const playerScoreTextBlock = this.advancedTexture.getControlByName("own-score");
        if (!opponentScoreTextBlock || !playerScoreTextBlock) {
            throw new Error("GUIのスコアテキストが見つかりません。");
        }
        if (!(opponentScoreTextBlock instanceof TextBlock)
            || !(playerScoreTextBlock instanceof TextBlock)) {
            throw new Error("GUIのスコアテキストがTextBlockではありません。");
        }
        this.opponentScoreTextBlock = opponentScoreTextBlock;
        this.playerScoreTextBlock = playerScoreTextBlock;
        this.opponentScore = 0;
        this.playerScore = 0;
    }

    public setScore(playerScore: number, opponentScore: number) {
        this.opponentScore = opponentScore;
        this.playerScore = playerScore;
        this.opponentScoreTextBlock.text = opponentScore.toString();
        this.playerScoreTextBlock.text = playerScore.toString();
    }

    public static async createPongGUI(scene: Scene) {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        const loadedGUI = await advancedTexture.parseFromURLAsync("/guiTexture.json");
        return new PongGUI(loadedGUI);
    }
}
