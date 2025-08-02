import { render } from './tournamentView';

/**
 * トーナメント詳細画面を描画する
 */
export function renderTournamentScreen(appElement: HTMLElement, tournamentData: any, myUserId: string | null, participants: any): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
        const { id: tournamentId, name, histories, champion, state, owner_id, is_participating ,is_owner} = tournamentData;
    let contentHTML;

    switch(state) {
        case 'reception': {
            const isAlreadyParticipating = is_participating || false;    
            
            const joinButtonHTML = !isAlreadyParticipating ? 
                `<button class="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white" onclick="window.router.handleJoinTournament('${tournamentId}')">
                    トーナメントに参加する
                </button>` 
                : `<p class="mt-6 text-green-400">あなたは既に参加しています。</p>`;

            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">オーナーがトーナメントを開始するのを待っています...</p>
                    <h4 class="text-lg font-bold mb-2">現在の参加者 (${participants.length}人)</h4>
                    <ul class="text-left max-w-xs mx-auto mb-4">
                        ${participants.map((p: any) => `
                            <li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2 hover:bg-gray-600 transition-colors">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    ${p.name.charAt(0).toUpperCase()}
                                </div>
                                <span class="text-white font-medium">${p.name}</span>
                                <span class="ml-auto text-xs px-2 py-1 rounded-full ${
                                    p.state === 'ready' ? 'bg-green-500 text-white' : 
                                    p.state === 'pending' ? 'bg-yellow-500 text-black' : 
                                    'bg-gray-500 text-white'
                                }">${p.state}</span>
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
            
            let readyButtonHTML = '';
            if (isParticipant) {
                // ユーザーが参加者の場合、readyボタンを表示
                readyButtonHTML = `
                    <div class="mt-6">
                        <button class="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold" onclick="window.router.handleSetReady('${tournamentId}', 'ready')">
                            準備完了にする
                        </button>
                    </div>`;
            }
            
            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">トーナメントは開始されています。</p>
                    <h4 class="text-lg font-bold mb-2">参加者 (${participants.length}人)</h4>
                    <ul class="text-left max-w-xs mx-auto mb-4">
                        ${participants.map((p: any) => `
                            <li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2 hover:bg-gray-600 transition-colors">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    ${p.name.charAt(0).toUpperCase()}
                                </div>
                                <span class="text-white font-medium">${p.name}</span>
                                <span class="ml-auto text-xs px-2 py-1 rounded-full ${
                                    p.state === 'ready' ? 'bg-green-500 text-white' : 
                                    p.state === 'pending' ? 'bg-yellow-500 text-black' : 
                                    'bg-gray-500 text-white'
                                }">${p.state}</span>
                            </li>
                        `).join('')}
                    </ul>
                    ${readyButtonHTML}
                </div>`;
            break;
        }

        case 'close': {

            // const champion = histories.find((h: any) => h.is_winner);
            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">トーナメントは閉鎖されています。</p>
                </div>`;
            break;
        }
    }

    const finalHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-6 rounded-lg text-white">
            <h2 class="text-3xl font-bold text-center mb-6">${name}</h2>
            ${contentHTML}
        </div>
    `;
    render(appElement, finalHTML);
} 
