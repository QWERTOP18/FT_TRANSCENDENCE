function render(appElement: HTMLElement, content: string): void {
    appElement.innerHTML = content;
}

export function renderCreateTournamentScreen(appElement: HTMLElement): void {
    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white w-full max-w-lg mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Create New Tournament</h2>
            <form onsubmit="window.router.handleCreateTournament(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Tournament Name</label>
                    <input type="text" id="name" name="name" required class="w-full bg-gray-700 rounded px-3 py-2">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 rounded px-3 py-2"></textarea>
                </div>
                <div class="mb-4">
                    <label for="max_num" class="block text-sm font-medium text-gray-300 mb-1">Max Participants</label>
                    <input type="number" id="max_num" name="max_num" value="2" min="2" required class="w-full bg-gray-700 rounded px-3 py-2">
                </div>
                <div class="mb-6">
                    <label for="rule" class="block text-sm font-medium text-gray-300 mb-1">Rule</label>
                    <select id="rule" name="rule" class="w-full bg-gray-700 rounded px-3 py-2">
                        <option value="simple">Simple</option>
                    </select>
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold">作成する</button>
            </form>
        </div>
    `;
    render(appElement, contentHTML);
}

/**
 * トーナメント一覧画面を描画する
 */
export function renderTournamentListScreen(appElement: HTMLElement, tournaments: any[], myUserId: string | null, userDatabase: any): void {
    const listHTML = tournaments.map(t => {
        const adminButtonHTML = t.owner_id === myUserId ?
            `<button class="mt-2 block w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold text-sm" onclick="window.router.navigateTo('/tournament/admin/${t.id}')">
                管理する
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
                </div>
            </div>
        `;
    }).join('');

    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white w-full max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-8">Tournament List</h2>
            ${listHTML}
        </div>
    `;
    render(appElement, contentHTML);
}

/**
 * トーナメント詳細画面を描画する
 */
export function renderTournamentScreen(appElement: HTMLElement, tournamentData: any, userDatabase: any, myUserId: string | null): void {
    if (!tournamentData) {
        render(appElement, `<p class="text-red-500">Tournament data not found.</p>`);
        return;
    }
    const { id: tournamentId, name, participants, histories, champion, state, owner_id } = tournamentData;
    let contentHTML;

    switch(state) {
        case 'reception': {
            // ★★★ 修正点：参加者データの形式を柔軟に判定 ★★★
            const participantIds = participants.map((p: any) => p.userId || p.id || p);
            const isParticipant = myUserId ? participantIds.includes(myUserId) : false;
            
            const joinButtonHTML = !isParticipant ? 
                `<button class="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white" onclick="window.router.handleJoinTournament('${tournamentId}')">
                    トーナメントに参加する
                </button>` 
                : `<p class="mt-6 text-green-400">あなたは既に参加しています。</p>`;

            const participantsList = participants.map((p: any) => {
                const userId = p.userId || p.id || p;
                const user = userDatabase[userId] || { name: 'Unknown User', image: '' };
                return `<li class="flex items-center gap-4 py-2 px-4 bg-gray-700 rounded mb-2"><img src="${user.image || ''}" class="player-avatar"><span>${user.name}</span></li>`;
            }).join('');

            contentHTML = `
                <div class="text-center">
                    <p class="text-yellow-400 mb-4">オーナーがトーナメントを開始するのを待っています...</p>
                    <h4 class="text-lg font-bold mb-2">現在の参加者 (${participants.length}人)</h4>
                    <ul class="text-left max-w-xs mx-auto">${participantsList}</ul>
                    ${joinButtonHTML}
                </div>`;
            break;
        }
        // ... (他のcase 'open', 'close' などは変更なし) ...
    }

    const finalHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-6 rounded-lg text-white">
            <h2 class="text-3xl font-bold text-center mb-6">${name}</h2>
            ${contentHTML}
        </div>
    `;
    render(appElement, finalHTML);
}


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
