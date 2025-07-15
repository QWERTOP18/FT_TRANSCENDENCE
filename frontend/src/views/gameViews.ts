import { gameState, gameEndState, MY_USERNAME } from '../data/mockData';

function render(appElement: HTMLElement, content: string) {
    appElement.innerHTML = content;
}

function drawGame(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const state = gameState.state;
    const paddleWidth = 100, paddleHeight = 20, ballRadius = 10;
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

export function renderGameScreen(appElement: HTMLElement) {
    const canvasWidth = 500;
    const canvasHeight = 700;
    const content = `<div class="flex justify-center items-center bg-white border-2 border-gray-800 shadow-lg rounded-lg"><canvas id="game-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas></div>`;
    render(appElement, content);
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    drawGame(ctx, canvasWidth, canvasHeight);
}

export function renderResultScreen(appElement: HTMLElement, isWin: boolean) {
    const result = gameEndState;
    const winnerCard = `<div class="flex flex-col items-center transform scale-110 font-bold"><img src="${result.winner_image}" alt="${result.winner}" class="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"><h3 class="text-2xl mt-4 mb-1">${result.winner}</h3><p class="text-4xl">${result.winner_score}</p></div>`;
    const loserCard = `<div class="flex flex-col items-center opacity-70"><img src="${result.loser_image}" alt="${result.loser}" class="w-28 h-28 rounded-full border-4 border-gray-400 object-cover"><h3 class="text-xl mt-4 mb-1">${result.loser}</h3><p class="text-3xl">${result.loser_score}</p></div>`;
    const content = `<div class="text-center bg-white p-10 rounded-lg shadow-xl"><h2 class="text-5xl font-extrabold mb-8 ${isWin ? 'text-green-500' : 'text-red-500'}">${isWin ? 'YOU WIN!' : 'YOU LOSE...'}</h2><div class="flex justify-around items-center gap-10">${isWin ? winnerCard + loserCard : loserCard + winnerCard}</div></div>`;
    render(appElement, content);
}

export function renderErrorScreen(appElement: HTMLElement) {
    const content = `<div class="text-center bg-white p-10 rounded-lg shadow-xl"><h2 class="text-5xl font-extrabold text-yellow-500">Error</h2><p class="mt-4 text-lg">An error occurred during the game.</p></div>`;
    render(appElement, content);
}
