import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

export class PongGUI {

    static instance: PongGUI | null;
    
    constructor(public advancedTexture: AdvancedDynamicTexture) {
    }

    public static setScore(opponentScore: number, playerScore: number) {
        const opponentScoreText = this.instance?.advancedTexture.getControlByName("opponent-score");
        const playerScoreText = this.instance?.advancedTexture.getControlByName("own-score");

        if (opponentScoreText instanceof TextBlock) {
            opponentScoreText.text = opponentScore.toString();
        }
        if (playerScoreText instanceof TextBlock) {
            playerScoreText.text = playerScore.toString();
        }
    }

    static async loadGUI(scene: Scene) {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
        this.instance = new PongGUI(advancedTexture);
        const loadedGUI = await advancedTexture.parseFromURLAsync("/guiTexture.json");
        return loadedGUI;
    }
}
