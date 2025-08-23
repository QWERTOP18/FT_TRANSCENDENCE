import { render } from './tournamentView';
import { t } from '../i18n';
import { escapeHTML } from '../utils/sanitizer';

/**
 * トーナメント開始画面を描画する
 */
export function renderEditTournamentScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
    if (!tournamentData.is_owner) {
        render(appElement, `<div class="text-center text-red-500 font-bold">${t('notedit')}</div>`);
        return;
    }
    
    const contentHTML = `
        <div class="metallic-card p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">${t('startNewTournament')}</h2>
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">${escapeHTML(tournamentData.name)}</h3>
                <p class="text-gray-300 mb-4">${escapeHTML(tournamentData.description)}</p>
                <div class="bg-gray-700 p-4 rounded-lg">
                    <p class="text-sm text-gray-400 mb-2">${t('nowstate')}<span class="text-yellow-400">${escapeHTML(tournamentData.state)}</span></p>
                    <p class="text-sm text-gray-400 mb-2">${t('memberCount')}${tournamentData.participants?.length || 0} / ${tournamentData.max_num}</p>
                    <p class="text-sm text-gray-400">${t('rule')}${escapeHTML(tournamentData.rule)}</p>
                </div>
            </div>
            <div class="bg-gray-800 bg-opacity-80 border border-gray-600 p-4 rounded-lg mb-6">
                <h4 class="text-blue-300 font-semibold mb-2">${t('atention')}</h4>
                <p class="text-sm text-gray-200">${t('startatention')}</p>
                ${tournamentData.participants && tournamentData.participants.length < 2 ? 
                    `<p class="text-sm text-red-300 mt-2 font-semibold">${t('startatention2')}</p>` : 
                    `<p class="text-sm text-green-300 mt-2 font-semibold">${t('okmember')}</p>`
                }
            </div>
            <div class="flex gap-4">
                <button type="button" class="flex-1 px-4 py-2 ${tournamentData.participants && tournamentData.participants.length >= 2 ? 'metallic-button-green' : 'bg-gray-500 cursor-not-allowed'} rounded text-white font-bold" onclick="window.router.handleOpenTournament()" ${tournamentData.participants && tournamentData.participants.length < 2 ? 'disabled' : ''}>
                    ${t('startNewTournament')}
                </button>
                <button type="button" class="flex-1 px-4 py-2 metallic-button rounded text-white font-bold" onclick="window.router.navigateTo('/tournaments')">
                    ${t('cancel')}
                </button>
            </div>
        </div>
    `;
    render(appElement, contentHTML);
} 
