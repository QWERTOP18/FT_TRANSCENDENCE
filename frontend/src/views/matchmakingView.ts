function render(appElement: HTMLElement, content: string) {
    appElement.innerHTML = content;
}

export function renderMatchmakingScreen(appElement: HTMLElement) {
    const content = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Matchmaking</h2>
            <p class="text-center text-gray-400 mb-6">下のボタンを押して、対戦待機キューに参加します。</p>
            <div class="text-center">
                <button class="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700" onclick="window.router.findMatch()">
                    Find Match
                </button>
            </div>
            <div class="mt-8">
                <h3 class="text-lg font-semibold mb-2">API Response:</h3>
                <pre id="response-data" class="bg-black p-4 rounded-md text-sm text-green-400 whitespace-pre-wrap">ここに結果が表示されます...</pre>
            </div>
        </div>
    `;
    render(appElement, content);
}
