import { userDatabase, MY_USER_ID } from '../data/mockData';

function render(appElement: HTMLElement, content: string) {
    appElement.innerHTML = content;
}

export function renderTournamentListScreen(appElement: HTMLElement, tournaments: any[]) {
    const listHTML = tournaments.map(t => `
        <div class="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center transition hover:bg-gray-600 shadow-lg">
            <div>
                <h3 class="text-xl font-bold text-white">${t.name}</h3>
                <p class="text-gray-400">${t.description}</p>
            </div>
            <div class="text-right">
                <span class="text-sm font-semibold px-3 py-1 rounded-full ${
                    t.state === 'open' ? 'bg-green-500 text-white' :
                    t.state === 'reception' ? 'bg-yellow-500 text-black' :
                    'bg-gray-500 text-white'
                }">${t.state}</span>
                <button class="mt-2 block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/detail/${t.id}')">
                    詳細を見る
                </button>
            </div>
        </div>
    `).join('');

    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white w-full max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-8">Tournament List</h2>
            ${listHTML}
        </div>
    `;
    render(appElement, contentHTML);
}

export function renderTournamentScreen(appElement: HTMLElement, tournamentData: any) {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }

    const { name, participants: initialParticipants, histories, champion_id, state, owner_id } = tournamentData;
    let contentHTML;

    switch(state) {
        case 'reception': {
            const participantsList = initialParticipants.map((p: any) => {
                const user = userDatabase[p.id] || { name: 'Unknown User', image: '' };
                return `<li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2"><img src="${user.image}" class="player-avatar"><span>${user.name}</span></li>`;
            }).join('');
            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">オーナーがトーナメントを開始するのを待っています...</p>
                    <h4 class="text-lg font-bold mb-2">現在の参加者 (${initialParticipants.length}人)</h4>
                    <ul class="text-left max-w-xs mx-auto">${participantsList}</ul>
                </div>`;
            break;
        }

        case 'open': {
            const getPlayerHTML_interactive = (participant: any) => {
                const { id, status } = participant;
                const user = userDatabase[id] || { name: 'Unknown', image: '' };
                return `<div class="matchup !flex-row justify-between items-center"><div class="player"><img src="${user.image}" class="player-avatar"><span>${user.name}</span></div><div class="flex items-center gap-4 ml-auto"><span class="status ${status === 'ready' ? 'text-green-400' : 'text-red-400'}">${status === 'ready' ? 'Ready' : 'Pending'}</span><button class="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 rounded" onclick="window.router.togglePlayerStatus('${id}')">Toggle</button></div></div>`;
            };
            const participantsListHTML = initialParticipants.map(getPlayerHTML_interactive).join('');
            const allPlayersReady = initialParticipants.every((p: any) => p.status === 'ready');
            const isOwner = MY_USER_ID === owner_id;
            let startButtonHTML = '';
            if (allPlayersReady && isOwner) {
                startButtonHTML = `<div class="mt-8 text-center animate-pulse"><button class="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700" onclick="window.router.startTournament()">試合開始</button></div>`;
            }
            contentHTML = `<div class="w-full max-w-md mx-auto">${participantsListHTML}${startButtonHTML}</div>`;
            break;
        }

        case 'close': {
            const numParticipants = initialParticipants.length;
            let bracketSize = 2;
            while (bracketSize < numParticipants) { bracketSize *= 2; }
            const players = [...initialParticipants];
            while (players.length < bracketSize) { players.push(null); }
            const rounds: any[] = [];
            let currentRoundPlayers = [...players];
            while (currentRoundPlayers.length > 1) {
                const round = { matches: [] as any[] };
                for (let i = 0; i < currentRoundPlayers.length; i += 2) {
                    round.matches.push({ player1: currentRoundPlayers[i], player2: currentRoundPlayers[i + 1], winner: null, score1: null, score2: null });
                }
                rounds.push(round);
                currentRoundPlayers = new Array(currentRoundPlayers.length / 2).fill(null);
            }
            rounds.forEach((round, rIndex) => {
                round.matches.forEach((match: any, mIndex: number) => {
                    if (match.player1 && !match.player2) match.winner = match.player1;
                    if (!match.player1 && match.player2) match.winner = match.player2;
                    const history = histories.find((h: any) => (h.winner.id === match.player1 && h.loser.id === match.player2) || (h.winner.id === match.player2 && h.loser.id === match.player1));
                    if (history) {
                        match.winner = history.winner.id;
                        if (history.winner.id === match.player1) {
                            match.score1 = history.winner.score; match.score2 = history.loser.score;
                        } else {
                            match.score1 = history.loser.score; match.score2 = history.winner.score;
                        }
                    }
                    if (match.winner && rounds[rIndex + 1]) {
                        const nextMatchIndex = Math.floor(mIndex / 2);
                        const playerSlot = mIndex % 2 === 0 ? 'player1' : 'player2';
                        rounds[rIndex + 1].matches[nextMatchIndex][playerSlot] = match.winner;
                    }
                });
            });
            const getPlayerHTML_bracket = (playerId: string | null, score: number | null = null, isWinner = false) => {
                if (!playerId) return `<div class="player text-gray-500">-- Bye --</div>`;
                const user = userDatabase[playerId] || { name: 'Unknown', image: '' };
                return `<div class="player ${isWinner ? 'font-bold text-yellow-300' : ''}"><img src="${user.image}" class="player-avatar"><span>${user.name}</span></div><div class="score ${isWinner ? 'font-bold text-yellow-300' : ''}">${score ?? ''}</div>`;
            };
            const roundsHTML = rounds.map(round => `<div class="round">${round.matches.map((match: any) => `<div class="matchup">${getPlayerHTML_bracket(match.player1, match.score1, match.winner === match.player1)}${getPlayerHTML_bracket(match.player2, match.score2, match.winner === match.player2)}</div>`).join('')}</div>`).join('');
            const championHTML = champion_id ? `<div class="round"><div class="champion"><span class="text-yellow-400 text-2xl">🏆 CHAMPION 🏆</span>${getPlayerHTML_bracket(champion_id, null, true)}</div></div>` : '';
            contentHTML = `<div class="tournament-bracket">${roundsHTML}${championHTML}</div>`;
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

export function renderAdminScreen(appElement: HTMLElement, tournamentData: any) {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
    if (MY_USER_ID !== tournamentData.owner_id) {
        render(appElement, `<div class="text-center text-red-500 font-bold">アクセス権がありません。</div>`);
        return;
    }
    
    let actionButtonHTML = '';
    if (tournamentData.state === 'reception') {
        actionButtonHTML = `
            <div class="mt-8 border-t border-gray-600 pt-6">
                <h3 class="text-lg font-semibold mb-2">トーナメントを開始する</h3>
                <p class="text-sm text-gray-400 mb-4">参加者を確定し、対戦をオープンします。この操作は元に戻せません。</p>
                <button class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold" onclick="window.router.openTournament()">
                    トーナメントをオープンする
                </button>
            </div>
        `;
    } else if (tournamentData.state === 'open') {
         actionButtonHTML = `<div class="mt-8 text-center text-green-400 font-bold">トーナメントはオープン中です。</div>`;
    }

    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-2xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">トーナメント管理</h2>
            <form onsubmit="window.router.handleAdminFormSubmit(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">トーナメント名</label>
                    <input type="text" id="name" name="name" value="${tournamentData.name}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">説明</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">${tournamentData.description}</textarea>
                </div>
                <div class="mb-6">
                    <label for="max_participants" class="block text-sm font-medium text-gray-300 mb-1">最大参加人数</label>
                    <input type="number" id="max_participants" name="max_participants" value="${tournamentData.max_participants}" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">
                    変更を保存
                </button>
            </form>
            ${actionButtonHTML}
        </div>
    `;
    render(appElement, contentHTML);
}
