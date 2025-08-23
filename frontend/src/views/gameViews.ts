import { PongGame } from '../PongGame/PongGame';
import { getUserId } from '../services/auth';
import { t } from '../i18n';
import { StateReloader } from '../utils/StateReloader';
import { escapeHTML } from '../utils/sanitizer';

// 作成されたPongGameインスタンスを保持するための変数
let pongGameInstance: PongGame | null = null;

function render(appElement: HTMLElement, content: string): void {
    appElement.innerHTML = content;
}

/**
 * ゲーム画面の骨格を描画し、Pongゲームを開始する
 * @param appElement 描画対象
 * @param gameParams ゲーム開始に必要な情報（AI対戦か、ルーム接続かなど）
 */
export async function renderGameScreen(appElement: HTMLElement, gameParams: any): Promise<void> {
    StateReloader.clearInstance();
    // 以前のゲームインスタンスが残っていれば、必ず破棄する
    if (pongGameInstance) {
        pongGameInstance.dispose();
        pongGameInstance = null;
        console.log("Previous game instance disposed.");
    }

    const contentHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center">
            <div class="w-full max-w-4xl flex justify-center items-center mb-4">
                <h2 class="text-2xl font-bold text-white">${escapeHTML(gameParams.title || 'Pong Game')}</h2>
            </div>
            <canvas id="pong-canvas" class="bg-black border-2 border-white w-4/5 h-5/6 max-w-4xl max-h-5xl rounded-lg shadow-2xl"></canvas>
        </div>
    `;
    render(appElement, contentHTML);

    const canvas = document.getElementById('pong-canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    try {
        // PongGameを起動
        const game = await PongGame.bootPongGame(canvas);
        pongGameInstance = game;

        // AI対戦の場合
        if (gameParams.type === 'ai') {
            game.battleAi({
                aiLevel: gameParams.aiLevel,
                userId: gameParams.userId,
                onStart: () => {
                    console.log("AI game started!");
                    canvas.focus();
                },
                onEnd: () => {
                    alert(`${t('ai_gamend')}`); // ゲーム終了時のアラート
                    // 終了後はトーナメント一覧などに戻る
                    (window as any).router.handleLocation();
                }
            });
        }
        // ルーム接続の場合
        else if (gameParams.type === 'room') {
            const userId = getUserId();
            if (!userId) {
                alert(`${t('notloggedin')}`);
                return;
            }
            
            game.connectRoom({
                roomId: gameParams.roomId,
                userId: userId,
                onConnect: () => {
                    console.log("Connected to room!");
                    canvas.focus();
                },
                onEnd: () => {
                    alert(`${t('room_gamend')}`); // ゲーム終了時のアラート
                    (window as any).router.navigateTo('/tournaments');
                }
            });
        }

    } catch (error) {
        console.error("Failed to boot Pong game:", error);
        appElement.innerHTML = `<p class="text-red-500">${t('Failedloadgame')}</p>`;
    }
}

export function renderErrorScreen(appElement: HTMLElement) {
    const content = `<div class="metallic-card text-center p-10 rounded-lg shadow-xl"><h2 class="text-5xl font-extrabold text-yellow-500">Error</h2><p class="mt-4 text-lg">${t('errorgame')}</p></div>`;
    render(appElement, content);
}
