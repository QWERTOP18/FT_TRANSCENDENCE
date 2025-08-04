import { render } from './tournamentView';
import { createHeader } from './header';
import { t } from '../i18n';

/**
 * トーナメント管理画面を描画する
 */
export function renderAdminScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">${t('tournamentnotfound')}</p>`);
        return;
    }
    if (myUserId !== tournamentData.owner_id) {
        render(appElement, `<div class="text-center text-red-500 font-bold">${t('notaccess')}</div>`);
        return;
    }
    
    let actionButtonHTML = '';
    if (tournamentData.state === 'reception') {
        actionButtonHTML = `<div class="mt-8 border-t border-gray-600 pt-6"><h3 class="text-lg font-semibold mb-2">${t('startNewTournament')}</h3><p class="text-sm text-gray-400 mb-4">${t('tounamentopen')}</p><button class="w-full px-4 py-2 metallic-button-green rounded text-white font-bold" onclick="window.router.openTournament()">${t('openTournament')}</button></div>`;
    } else if (tournamentData.state === 'open' || tournamentData.state === 'in_progress') {
         actionButtonHTML = `<div class="mt-8 text-center text-green-400 font-bold">${t('tournemntprogress')}</div>`;
    }

    const contentHTML = `
        ${createHeader()}
        <div class="metallic-card p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">${t('tournamentadmin')}</h2>
            <form onsubmit="window.router.handleAdminFormSubmit(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">${t('tournamentName')}</label>
                    <input type="text" id="name" name="name" value="${tournamentData.name}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-blue-500 focus:outline-none">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">${t('description')}</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-blue-500 focus:outline-none">${tournamentData.description}</textarea>
                </div>
                <div class="mb-6">
                    <label for="max_participants" class="block text-sm font-medium text-gray-300 mb-1">${t('max')}</label>
                    <input type="number" id="max_participants" name="max_participants" value="${tournamentData.max_participants}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:border-blue-500 focus:outline-none">
                </div>
                <button type="submit" class="w-full px-4 py-2 metallic-button-blue rounded text-white font-bold">${t('saveChanges')}</button>
            </form>
            ${actionButtonHTML}
        </div>
    `;
    render(appElement, contentHTML);
} 
