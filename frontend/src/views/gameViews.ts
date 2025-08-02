import { gameEndState } from '../data/mockData';
import { PongGame } from '../PongGame/PongGame';


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
    // 以前のゲームインスタンスが残っていれば、必ず破棄する
    if (pongGameInstance) {
        pongGameInstance.dispose();
        pongGameInstance = null;
        console.log("Previous game instance disposed.");
    }

    const contentHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center">
            <div class="w-full max-w-4xl flex justify-between items-center mb-4">
                <button class="px-4 py-2 metallic-button rounded text-white hover:bg-gray-600 transition-colors" onclick="window.router.navigateTo('/tournaments')">
                    ← Home
                </button>
                <h2 class="text-2xl font-bold text-white">${gameParams.title || 'Pong Game'}</h2>
                <div class="w-24"></div>
            </div>
            <canvas id="pong-canvas" class="bg-black border-2 border-white w-4/5 h-4/5 max-w-4xl max-h-4xl rounded-lg shadow-2xl"></canvas>
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
                    alert('AI対戦が終了しました。');
                    // 終了後はトーナメント一覧などに戻る
                    (window as any).router.navigateTo('/tournaments');
                }
            });
        }
        // ルーム接続の場合
        else if (gameParams.type === 'room') {
            game.connectRoom({
                roomId: gameParams.roomId,
                userId: gameParams.token,
                onConnect: () => {
                    console.log("Connected to room!");
                    canvas.focus();
                },
                onEnd: () => {
                    alert('対戦が終了しました。');
                    (window as any).router.navigateTo('/tournaments');
                }
            });
        }

    } catch (error) {
        console.error("Failed to boot Pong game:", error);
        appElement.innerHTML = `<p class="text-red-500">Failed to load game.</p>`;
    }
}

export function renderResultScreen(appElement: HTMLElement, isWin: boolean) {
    const result = gameEndState;
    const winnerCard = `<div class="flex flex-col items-center transform scale-110 font-bold"><img src="${result.winner_image}" alt="${result.winner}" class="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"><h3 class="text-2xl mt-4 mb-1">${result.winner}</h3><p class="text-4xl">${result.winner_score}</p></div>`;
    const loserCard = `<div class="flex flex-col items-center opacity-70"><img src="${result.loser_image}" alt="${result.loser}" class="w-28 h-28 rounded-full border-4 border-gray-400 object-cover"><h3 class="text-xl mt-4 mb-1">${result.loser}</h3><p class="text-3xl">${result.loser_score}</p></div>`;
    const content = `<div class="metallic-card text-center p-10 rounded-lg shadow-xl"><h2 class="text-5xl font-extrabold mb-8 ${isWin ? 'text-green-500' : 'text-red-500'}">${isWin ? 'YOU WIN!' : 'YOU LOSE...'}</h2><div class="flex justify-around items-center gap-10">${isWin ? winnerCard + loserCard : loserCard + winnerCard}</div></div>`;
    render(appElement, content);
}

export function renderErrorScreen(appElement: HTMLElement) {
    const content = `<div class="metallic-card text-center p-10 rounded-lg shadow-xl"><h2 class="text-5xl font-extrabold text-yellow-500">Error</h2><p class="mt-4 text-lg">An error occurred during the game.</p></div>`;
    render(appElement, content);
}
