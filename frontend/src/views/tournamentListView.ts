import { render } from './tournamentView';
import { createHeader } from './header';
import { t } from '../i18n';

/**
 * トーナメント一覧画面を描画する
 */
export function renderTournamentListScreen(appElement: HTMLElement, tournaments: any[], myUserId: string | null): void {
    const listHTML = tournaments.reverse().map(tournament => {
        const adminButtonHTML = tournament.owner_id === myUserId ?
            `<button class="mt-2 block w-full px-4 py-2 metallic-button-red rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/admin/${tournament.id}')">
                ${t('manage')}
            </button>` : '';

        const editButtonHTML = tournament.is_owner && tournament.state === 'reception' ?
            `<button class="mt-2 block w-full px-4 py-2 metallic-button-orange rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/edit/${tournament.id}')">
                ${t('start')}
            </button>` : '';

        return `
            <div class="metallic-card p-4 rounded-lg mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:scale-102 duration-200 gap-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-white">${tournament.name}</h3>
                    <p class="text-gray-300">${tournament.description}</p>
                </div>
                <div class="text-right sm:text-right w-full sm:w-32 flex-shrink-0">
                    <span class="text-sm font-semibold px-3 py-1 rounded-full metallic-status ${
                        tournament.state === 'open' ? 'metallic-status-open' :
                        tournament.state === 'reception' ? 'metallic-status-reception' :
                        'metallic-status-close'
                    }">${tournament.state}</span>
                    <button class="mt-2 block w-full px-4 py-2 metallic-button-blue rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/detail/${tournament.id}')">
                        ${t('detail')}
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
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 class="text-3xl font-bold">${t('TournamentList')}</h2>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button class="px-6 py-2 metallic-button-purple rounded text-white font-bold" onclick="window.router.handlePlayAi()">
                        ${t('vsAI')}
                    </button>
                    <button class="px-6 py-2 metallic-button-green rounded text-white font-bold" onclick="window.router.navigateTo('/tournaments/new')">
                        ${t('createTournamentTitle')}
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
