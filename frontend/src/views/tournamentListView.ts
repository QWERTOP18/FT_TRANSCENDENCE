import { render } from './tournamentView';
import { createHeader } from './header';

/**
 * トーナメント一覧画面を描画する
 */
export function renderTournamentListScreen(appElement: HTMLElement, tournaments: any[], myUserId: string | null): void {
    const listHTML = tournaments.reverse().map(t => {
        const adminButtonHTML = t.owner_id === myUserId ?
            `<button class="mt-2 block w-full px-4 py-2 metallic-button-red rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/admin/${t.id}')">
                管理する
            </button>` : '';

        const editButtonHTML = t.is_owner && t.state === 'reception' ?
            `<button class="mt-2 block w-full px-4 py-2 metallic-button-orange rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/edit/${t.id}')">
                開始する
            </button>` : '';

        return `
            <div class="metallic-card p-4 rounded-lg mb-4 flex justify-between items-center transition hover:scale-102 duration-200">
                <div>
                    <h3 class="text-xl font-bold text-white">${t.name}</h3>
                    <p class="text-gray-300">${t.description}</p>
                </div>
                <div class="text-right w-32 flex-shrink-0">
                    <span class="text-sm font-semibold px-3 py-1 rounded-full metallic-status ${
                        t.state === 'open' ? 'metallic-status-open' :
                        t.state === 'reception' ? 'metallic-status-reception' :
                        'metallic-status-close'
                    }">${t.state}</span>
                    <button class="mt-2 block w-full px-4 py-2 metallic-button-blue rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/detail/${t.id}')">
                        詳細を見る
                    </button>
                    ${adminButtonHTML}
                    ${editButtonHTML}
                </div>
            </div>
        `;
    }).join('');

    const contentHTML = `
        ${createHeader()}
        <div class="metallic-card p-8 rounded-lg text-white w-full max-w-3xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold">Tournament List</h2>
                <div class="flex gap-2">
                    <button class="px-6 py-2 metallic-button-purple rounded text-white font-bold" onclick="window.router.handlePlayAi()">
                        Play vs AI
                    </button>
                    <button class="px-6 py-2 metallic-button-green rounded text-white font-bold" onclick="window.router.navigateTo('/tournaments/new')">
                        Create Tournament
                    </button>
                </div>
            </div>
            <div class="max-h-96 overflow-y-auto pr-2">
                ${listHTML}
            </div>
        </div>
    `;
    render(appElement, contentHTML);
} 
