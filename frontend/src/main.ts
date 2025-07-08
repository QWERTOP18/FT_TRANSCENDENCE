const MY_USERNAME = "kotaro";

const gameState = {
    type: "gameState",
    state: { paddle1Y: 250, paddle2Y: 350, ballX: 130, ballY: 30, score1: 2, score2: 5 },
};
const gameEndState = {
    type: "gameEND",
    round: 1,
    winner_score: 5, loser_score: 2,
    winner: "yui", loser: "kotaro",
    winner_image: "https://via.placeholder.com/150/4299E1/FFFFFF?Text=Yui",
    loser_image: "https://via.placeholder.com/150/F56565/FFFFFF?Text=Kotaro",
};

class AppRouter {
    private appElement: HTMLElement;

    constructor() {
        this.appElement = document.getElementById('app')!;
        window.addEventListener('popstate', () => this.handleLocation());
    }

    public navigateTo(path: string) {
        if (window.location.pathname === path) return;
        history.pushState({}, '', path);
        this.handleLocation();
    }

    public handleLocation() {
        const path = window.location.pathname;
        switch (path) {
            case '/game':
                this.renderGameScreen();
                break;
            case '/win':
                this.renderResultScreen({ ...gameEndState, winner: MY_USERNAME, loser: 'opponent' });
                break;
            case '/lose':
                this.renderResultScreen({ ...gameEndState, winner: 'opponent', loser: MY_USERNAME });
                break;
            case '/error':
                this.renderErrorScreen();
                break;
            default:
                this.navigateTo('/game');
                break;
        }
    }

    private render(content: string) {
        this.appElement.innerHTML = content;
    }

    // --- 各画面の描画メソッド（Tailwind CSS版） ---

    private renderGameScreen() {
        const canvasWidth = 500
        const canvasHeight = 700
        
        // Tailwindのクラスを使って中央寄せ
        this.render(`
            <div class="flex justify-center items-center bg-white border-2 border-gray-800 shadow-lg rounded-lg">
                <canvas id="game-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
            </div>
        `);
        
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        this.drawGame(ctx, canvasWidth, canvasHeight);
    }

    private drawGame(ctx: CanvasRenderingContext2D, width: number, height: number) {
        /* ... Canvasの描画ロジックは変更なし ... */
        const state = gameState.state;
        const paddleWidth = 100;
        const paddleHeight = 20;
        const ballRadius = 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.font = '32px sans-serif';
        ctx.fillText(state.score1.toString(), 30, 50);
        ctx.fillText(state.score2.toString(), width - 50, height - 30);
        ctx.fillRect(state.paddle1Y - paddleWidth / 2, 20, paddleWidth, paddleHeight);
        ctx.fillRect(state.paddle2Y - paddleWidth / 2, height - 40, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(state.ballX, state.ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    private renderResultScreen(result: typeof gameEndState) {
        const isWin = result.winner === MY_USERNAME;
        
        const winnerCard = `
            <div class="flex flex-col items-center transform scale-110 font-bold">
                <img src="${result.winner_image}" alt="${result.winner}" class="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg">
                <h3 class="text-2xl mt-4 mb-1">${result.winner}</h3>
                <p class="text-4xl">${result.winner_score}</p>
            </div>
        `;
        const loserCard = `
            <div class="flex flex-col items-center opacity-70">
                <img src="${result.loser_image}" alt="${result.loser}" class="w-28 h-28 rounded-full border-4 border-gray-400 object-cover">
                <h3 class="text-xl mt-4 mb-1">${result.loser}</h3>
                <p class="text-3xl">${result.loser_score}</p>
            </div>
        `;

        this.render(`
            <div class="text-center bg-white p-10 rounded-lg shadow-xl">
                <h2 class="text-5xl font-extrabold mb-8 ${isWin ? 'text-green-500' : 'text-red-500'}">
                    ${isWin ? 'YOU WIN!' : 'YOU LOSE...'}
                </h2>
                <div class="flex justify-around items-center gap-10">
                    ${isWin ? winnerCard + loserCard : loserCard + winnerCard}
                </div>
            </div>
        `);
    }

    private renderErrorScreen() {
        this.render(`
            <div class="text-center bg-white p-10 rounded-lg shadow-xl">
                <h2 class="text-5xl font-extrabold text-yellow-500">Error</h2>
                <p class="mt-4 text-lg">An error occurred during the game.</p>
            </div>
        `);
    }
}

const router = new AppRouter();
(window as any).router = router;
router.handleLocation();
