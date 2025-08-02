import { render } from './tournamentView';

/**
 * トーナメント開始画面を描画する
 */
export function renderEditTournamentScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
    if (!tournamentData.is_owner) {
        render(appElement, `<div class="text-center text-red-500 font-bold">編集権限がありません。</div>`);
        return;
    }
    
    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">トーナメント開始</h2>
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">${tournamentData.name}</h3>
                <p class="text-gray-300 mb-4">${tournamentData.description}</p>
                <div class="bg-gray-700 p-4 rounded-lg">
                    <p class="text-sm text-gray-400 mb-2">現在の状態: <span class="text-yellow-400">${tournamentData.state}</span></p>
                    <p class="text-sm text-gray-400 mb-2">参加者数: ${tournamentData.participants?.length || 0} / ${tournamentData.max_num}</p>
                    <p class="text-sm text-gray-400">ルール: ${tournamentData.rule}</p>
                </div>
            </div>
            <div class="bg-yellow-900 bg-opacity-50 border border-yellow-600 p-4 rounded-lg mb-6">
                <h4 class="text-yellow-400 font-semibold mb-2">⚠️ 注意</h4>
                <p class="text-sm text-yellow-300">トーナメントを開始すると、新しい参加者の追加ができなくなります。</p>
                ${tournamentData.participants && tournamentData.participants.length < 2 ? 
                    '<p class="text-sm text-red-300 mt-2">⚠️ 最低2人以上の参加者が必要です。</p>' : 
                    '<p class="text-sm text-green-300 mt-2">✅ 参加者数が十分です。</p>'
                }
            </div>
            <div class="flex gap-4">
                <button type="button" class="flex-1 px-4 py-2 ${tournamentData.participants && tournamentData.participants.length >= 2 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'} rounded text-white font-bold" onclick="window.router.handleOpenTournament()" ${tournamentData.participants && tournamentData.participants.length < 2 ? 'disabled' : ''}>
                    トーナメントを開始する
                </button>
                <button type="button" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-bold" onclick="window.router.navigateTo('/tournaments')">
                    キャンセル
                </button>
            </div>
        </div>
    `;
    render(appElement, contentHTML);
} 
