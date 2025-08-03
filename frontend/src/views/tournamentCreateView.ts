import { render } from './tournamentView';
import { createHeader } from './header';
import { t } from '../i18n';

export function renderCreateTournamentScreen(appElement: HTMLElement): void {
    const contentHTML = `
        ${createHeader()}
        <div class="metallic-card p-8 rounded-lg text-white w-full max-w-lg mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">${t('createTournamentTitle')}</h2>
            <form onsubmit="window.router.handleCreateTournament(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">${t('tournamentName')}</label>
                    <input type="text" id="name" name="name" required class="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">${t('description')}</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"></textarea>
                </div>
                <div class="mb-4">
                    <label for="max_num" class="block text-sm font-medium text-gray-300 mb-1">${t('max')}</label>
                    <input type="number" id="max_num" name="max_num" value="2" min="2" required class="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                </div>
                <div class="mb-6">
                    <label for="rule" class="block text-sm font-medium text-gray-300 mb-1">${t('rule')}</label>
                    <select id="rule" name="rule" class="w-full bg-gray-700 rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                        <option value="simple">${t('Simple')}</option>
                    </select>
                </div>
                <button type="submit" class="w-full px-4 py-2 metallic-button-green rounded text-white font-bold">${t('creat')}</button>
            </form>
        </div>
    `;
    render(appElement, contentHTML);
} 
