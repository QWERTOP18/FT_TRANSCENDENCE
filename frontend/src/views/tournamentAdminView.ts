import { render } from './tournamentView';

/**
 * トーナメント管理画面を描画する
 */
export function renderAdminScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
    if (myUserId !== tournamentData.owner_id) {
        render(appElement, `<div class="text-center text-red-500 font-bold">アクセス権がありません。</div>`);
        return;
    }
    
    let actionButtonHTML = '';
    if (tournamentData.state === 'reception') {
        actionButtonHTML = `<div class="mt-8 border-t border-gray-600 pt-6"><h3 class="text-lg font-semibold mb-2">トーナメントを開始する</h3><p class="text-sm text-gray-400 mb-4">参加者を確定し、対戦をオープンします。</p><button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold" onclick="window.router.openTournament()">トーナメントをオープンする</button></div>`;
    } else if (tournamentData.state === 'open' || tournamentData.state === 'in_progress') {
         actionButtonHTML = `<div class="mt-8 text-center text-green-400 font-bold">トーナメントは進行中です。</div>`;
    }

    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">トーナメント管理</h2>
            <form onsubmit="window.router.handleAdminFormSubmit(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">トーナメント名</label>
                    <input type="text" id="name" name="name" value="${tournamentData.name}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">説明</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">${tournamentData.description}</textarea>
                </div>
                <div class="mb-6">
                    <label for="max_participants" class="block text-sm font-medium text-gray-300 mb-1">最大参加人数</label>
                    <input type="number" id="max_participants" name="max_participants" value="${tournamentData.max_participants}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">変更を保存</button>
            </form>
            ${actionButtonHTML}
        </div>
    `;
    render(appElement, contentHTML);
} 
