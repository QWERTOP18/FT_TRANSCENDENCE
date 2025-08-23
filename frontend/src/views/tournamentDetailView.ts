import { render } from './tournamentView';
import { createHeader } from './header';
import { t } from '../i18n';
import { StateReloader } from '../utils/StateReloader';
import * as api from '../services/api';
import { escapeHTML } from '../utils/sanitizer';

/**
 * トーナメント詳細画面を描画する
 */
export function renderTournamentScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null, participants: any): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">${t('tournamentnotfound')}</p>`);
        return;
    }
    const { id: tournamentId, name, histories, champion, state, owner_id, is_participating ,is_owner} = tournamentData;
    let contentHTML;

    StateReloader.create({
        initialValue: {
            ...tournamentData,
            participants: participants
        },
        updater: async () => {
            const tournament = await api.getTournamentById(tournamentData.id)
            const participants = await api.getTournamentParticipants(tournamentData.id);
            return {
                ...tournament,
                participants: participants
            }
        },
        onUpdate: (newState) => {
            console.log('Tournament data updated:', newState);
            StateReloader.clearInstance();
            (window as any).router.handleLocation();
        }
    });
    switch(state) {
        case 'reception': {
            const isAlreadyParticipating = is_participating || false;    
            
            const joinButtonHTML = !isAlreadyParticipating ? 
                `<button class="mt-6 px-6 py-2 metallic-button-blue rounded text-white" onclick="window.router.handleJoinTournament('${tournamentId}')">
                    ${t('joinTournament')}
                </button>` 
                : `<p class="mt-6 text-green-400">${t('alreadyParticipating')}</p>`;

            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">${t('waitingForOwner')}</p>
                    <h4 class="text-lg font-bold mb-2">${t('nowmember')} (${participants.length}${t('num')})</h4>
                    <ul class="text-left max-w-xs mx-auto mb-4">
                        ${participants.map((p: any) => `
                            <li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2 hover:bg-gray-600 transition-colors">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    ${escapeHTML(p.name.charAt(0).toUpperCase())}
                                </div>
                                <span class="text-white font-medium">${escapeHTML(p.name)}</span>
                                <span class="ml-auto text-xs px-2 py-1 rounded-full metallic-status ${
                                    p.state === 'ready' ? 'metallic-status-ready' : 
                                    p.state === 'pending' ? 'metallic-status-pending' : 
                                    'metallic-status-pending'
                                }">${escapeHTML(p.state)}</span>
                            </li>
                        `).join('')}
                    </ul>
                    ${joinButtonHTML}
                </div>`;
            break;
        }
        case 'open': {
            // JSONに含まれているis_participatingプロパティを使用
            const isParticipant = tournamentData.is_participating || false;
            
            // 参加者をステータスでグループ化
            const groupedParticipants = participants.reduce((groups: any, participant: any) => {
                const state = participant.state || 'pending';
                if (!groups[state]) {
                    groups[state] = [];
                }
                groups[state].push(participant);
                return groups;
            }, {});
            
            // ステータスの表示順序を定義
            const stateOrder = ['ready', 'pending', 'in_progress', 'battled', 'eliminated', 'champion'];
            const stateLabels: Record<string, string> = {
                'ready': '準備完了',
                'pending': '準備中',
                'in_progress': '対戦中',
                'battled': '対戦済み',
                'eliminated': '敗退',
                'champion': '優勝者'
            };
            
            let readyButtonHTML = '';
            const is_pending = participants.find((p: any) => p.external_id === myUserId)?.state === 'pending';
            if (isParticipant && is_pending) {
                // ユーザーが参加者の場合、readyボタンを表示
                readyButtonHTML = `
                    <div class="mt-6">
                        <button class="px-6 py-2 metallic-button-green rounded text-white font-bold" onclick="window.router.handleSetReady('${tournamentId}', 'ready')">
                            準備完了にする
                        </button>
                    </div>`;
            }
            
            const participantsHTML = stateOrder
                .filter(state => groupedParticipants[state] && groupedParticipants[state].length > 0)
                .map(state => `
                    <div class="mb-6">
                        <h5 class="text-lg font-semibold mb-3 text-${state === 'ready' ? 'green' : state === 'pending' ? 'yellow' : state === 'in_progress' ? 'blue' : state === 'battled' ? 'purple' : state === 'eliminated' ? 'red' : 'gold'}-400">
                            ${escapeHTML(stateLabels[state] || state)} (${groupedParticipants[state].length}人)
                        </h5>
                        <ul class="text-left max-w-xs mx-auto">
                            ${groupedParticipants[state].map((p: any) => `
                                <li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2 hover:bg-gray-600 transition-colors">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        ${escapeHTML(p.name.charAt(0).toUpperCase())}
                                    </div>
                                    <span class="text-white font-medium">${escapeHTML(p.name)}</span>
                                    <span class="ml-auto text-xs px-2 py-1 rounded-full metallic-status ${
                                        p.state === 'ready' ? 'metallic-status-ready' : 
                                        p.state === 'pending' ? 'metallic-status-pending' : 
                                        p.state === 'in_progress' ? 'metallic-status-in-progress' :
                                        p.state === 'battled' ? 'metallic-status-battled' :
                                        p.state === 'eliminated' ? 'metallic-status-eliminated' :
                                        p.state === 'champion' ? 'metallic-status-champion' :
                                        'metallic-status-pending'
                                    }">${escapeHTML(stateLabels[p.state] || p.state)}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('');

            // 自分がin_progressの場合のゲーム開始ボタン
            let gameStartButtonHTML = '';
            const myParticipant = participants.find((p: any) => p.external_id === myUserId);
            if (myParticipant && myParticipant.state === 'in_progress') {
                gameStartButtonHTML = `
                    <div class="mt-6">
                        <button class="px-6 py-2 metallic-button-green rounded text-white font-bold" onclick="window.router.handleStartGame('${tournamentId}')">
                            ゲーム開始
                        </button>
                    </div>`;
            }
            
            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">トーナメントは開始されています。</p>
                    <h4 class="text-lg font-bold mb-4">参加者 (${participants.length}人)</h4>
                    ${participantsHTML}
                    ${readyButtonHTML}
                    ${gameStartButtonHTML}
                </div>`;
            break;
        }

        case 'close': {
            // 参加者をステータスでグループ化
            const groupedParticipants = participants.reduce((groups: any, participant: any) => {
                const state = participant.state || 'pending';
                if (!groups[state]) {
                    groups[state] = [];
                }
                groups[state].push(participant);
                return groups;
            }, {});
            
            // ステータスの表示順序を定義
            const stateOrder = ['champion', 'eliminated', 'battled', 'in_progress', 'ready', 'pending'];
            const stateLabels: Record<string, string> = {
                'ready': '準備完了',
                'pending': '準備中',
                'in_progress': '対戦中',
                'battled': '対戦済み',
                'eliminated': '敗退',
                'champion': '優勝者'
            };
            
            const participantsHTML = stateOrder
                .filter(state => groupedParticipants[state] && groupedParticipants[state].length > 0)
                .map(state => `
                    <div class="mb-6">
                        <h5 class="text-lg font-semibold mb-3 text-${state === 'champion' ? 'gold' : state === 'eliminated' ? 'red' : state === 'battled' ? 'purple' : state === 'in_progress' ? 'blue' : state === 'ready' ? 'green' : 'yellow'}-400">
                            ${escapeHTML(stateLabels[state] || state)} (${groupedParticipants[state].length}人)
                        </h5>
                        <ul class="text-left max-w-xs mx-auto">
                            ${groupedParticipants[state].map((p: any) => `
                                <li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2 hover:bg-gray-600 transition-colors">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        ${escapeHTML(p.name.charAt(0).toUpperCase())}
                                    </div>
                                    <span class="text-white font-medium">${escapeHTML(p.name)}</span>
                                    <span class="ml-auto text-xs px-2 py-1 rounded-full metallic-status ${
                                        p.state === 'ready' ? 'metallic-status-ready' : 
                                        p.state === 'pending' ? 'metallic-status-pending' : 
                                        p.state === 'in_progress' ? 'metallic-status-in-progress' :
                                        p.state === 'battled' ? 'metallic-status-battled' :
                                        p.state === 'eliminated' ? 'metallic-status-eliminated' :
                                        p.state === 'champion' ? 'metallic-status-champion' :
                                        'metallic-status-pending'
                                    }">${escapeHTML(stateLabels[p.state] || p.state)}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('');

            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">トーナメントは閉鎖されています。</p>
                    <h4 class="text-lg font-bold mb-4">最終結果 (${participants.length}人)</h4>
                    ${participantsHTML}
                </div>`;
            break;
        }
    }

    const finalHTML = `
        ${createHeader()}
        <div class="metallic-card p-6 rounded-lg text-white">
            <div class="text-center mb-6">
                <h2 class="text-3xl font-bold">${escapeHTML(name)}</h2>
            </div>
            ${contentHTML}
        </div>
    `;
    render(appElement, finalHTML);
} 
