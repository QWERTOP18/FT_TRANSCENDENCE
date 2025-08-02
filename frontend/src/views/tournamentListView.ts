import { render } from './tournamentView';

/**
 * トーナメント一覧画面を描画する
 */
export function renderTournamentListScreen(appElement: HTMLElement, tournaments: any[], myUserId: string | null): void {
    const listHTML = tournaments.map(t => {
        const adminButtonHTML = t.owner_id === myUserId ?
            `<button class="mt-2 block w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/admin/${t.id}')">
                管理する
            </button>` : '';

        const editButtonHTML = t.is_owner && t.state !== 'open' ?
            `<button class="mt-2 block w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/edit/${t.id}')">
                開始する
            </button>` : '';

        return `
            <div class="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center transition hover:bg-gray-600 shadow-lg">
                <div>
                    <h3 class="text-xl font-bold text-white">${t.name}</h3>
                    <p class="text-gray-400">${t.description}</p>
                </div>
                <div class="text-right w-32 flex-shrink-0">
                    <span class="text-sm font-semibold px-3 py-1 rounded-full ${
                        t.state === 'open' ? 'bg-green-500 text-white' :
                        t.state === 'reception' ? 'bg-yellow-500 text-black' :
                        'bg-gray-500 text-white'
                    }">${t.state}</span>
                    <button class="mt-2 block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/detail/${t.id}')">
                        詳細を見る
                    </button>
                    ${adminButtonHTML}
                    ${editButtonHTML}
                </div>
            </div>
        `;
    }).join('');

    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white w-full max-w-3xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold">Tournament List</h2>
                <button class="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold" onclick="window.router.navigateTo('/tournaments/new')">
                    Create Tournament
                </button>
            </div>
            ${listHTML}
        </div>
    `;
    render(appElement, contentHTML);
} 
