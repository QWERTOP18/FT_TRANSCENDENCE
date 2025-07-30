function render(appElement: HTMLElement, content: string): void {
    appElement.innerHTML = content;
}

/**
 * マッチメイキング画面を描画する
 * @param appElement 描画対象のHTML要素
 */
export function renderMatchmakingScreen(appElement: HTMLElement): void {
    const content = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Play Game</h2>
            <p class="text-center text-gray-400 mb-8">対戦方法を選択してください。</p>
            
            <div class="flex flex-col md:flex-row gap-4">
                <button class="flex-1 px-6 py-4 text-lg font-bold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-transform transform hover:scale-105" onclick="window.router.handlePlayAi()">
                    Play against AI
                </button>
                
                <button class="flex-1 px-6 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105" onclick="window.router.handleCreateRoom()">
                    Create Multiplayer Room
                </button>
            </div>

            <div class="mt-8">
                <h3 class="text-lg font-semibold mb-2">API Response:</h3>
                <pre id="response-data" class="bg-black p-4 rounded-md text-sm text-green-400 whitespace-pre-wrap h-48 overflow-y-auto">ここに結果が表示されます...</pre>
            </div>
        </div>
    `;
    render(appElement, content);
}