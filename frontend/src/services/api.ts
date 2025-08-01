import { TOURNAMENT_URL, GAME_URL, SERVERURL } from '../config';
import { getAuthHeaders, getUserId, saveUserId } from './auth';

export async function signup(name: string) {
    try {
        const response = await fetch(`${SERVERURL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
}

export async function authenticate(name: string) {
    try {
        const response = await fetch(`${SERVERURL}/auth/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // ★★★ 修正点：'token'ではなく'id'を、saveUserIdで保存する ★★★
        if (data.id) {
            saveUserId(data.id);
        }
        return data;
    } catch (error) {
        console.error("Authentication failed:", error);
        throw error;
    }
}


// =======================================================
// Game Service (ゲーム・マッチメイキング関連)
// =======================================================

/**
 * AI対戦用のルームを作成する (POST /play-ai)
 */
export async function createAiRoom() {
    try {
        const userId = getUserId(); // localStorageからユーザーIDを取得
        if (!userId) {
            throw new Error('User is not logged in.');
        }

        const response = await fetch(`${GAME_URL}/play-ai`, {
            method: 'POST',
            headers: getAuthHeaders(),
            // ★★★ API仕様に合わせてリクエストボディを修正 ★★★
            body: JSON.stringify({
                aiLevel: 0, // AIレベルは一旦0で固定
                user_id: userId,
            }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to create AI room:', error);
        throw error;
    }
}

//8000番の方のai対戦

// export async function createAiRoom() {
//     try {
//         const response = await fetch(`${SERVERURL}/battle/ai`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify({}), // ★★★ API仕様に合わせてボディを空のオブジェクトにする ★★★
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         // ★★★ サーバーがJSONではなく文字列を返す問題に対応 ★★★
//         const roomId = await response.text(); 
        
//         // アプリケーションが使いやすいように、JSONオブジェクトの形に整形して返す
//         return { room_id: roomId };

//     } catch (error) {
//         console.error('Failed to create AI room:', error);
//         throw error;
//     }
// }

/**
 * マルチプレイヤー用のルームを作成する (POST /room)
 */
export async function createRoom(roomData: {
    tournament_id: string;
    player1_id: string;
    player2_id: string;
    winning_score: number;
}) {
    try {
        const response = await fetch(`${GAME_URL}/room`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(roomData),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to create room:', error);
        throw error;
    }
}

export async function startBattle(tournamentId: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${tournamentId}/battle/start`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * gameサーバーの死活確認 (GET /ping)
 */
export async function pingGameServer() {
    try {
        const response = await fetch(`${GAME_URL}/ping`);
        return response.ok;
    } catch (error) {
        console.error('Ping to game server failed:', error);
        return false;
    }
}


// =======================================================
// Tournament Service (トーナメント管理)
// =======================================================

/**
 * トーナメント一覧を取得する (GET /tournaments)
 */
export async function getTournaments() {
    const response = await fetch(`${SERVERURL}/tournaments`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 新しいトーナメントを作成する (POST /tournaments)
 */
export async function createTournament(data: { name: string; description: string; max_num: number; rule: string; }) {
    const response = await fetch(`${SERVERURL}/tournaments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 特定のトーナメント詳細を取得する (GET /tournaments/{id})
 */
export async function getTournamentById(id: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * トーナメントを開始（オープン）状態にする (PUT /tournaments/{id}/open)
 */
export async function openTournament(id: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${id}/open`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * トーナメントに参加者として自分を追加する (POST /tournaments/{id}/join)
 */
export async function joinTournament(tournamentId: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: "{}",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 参加者のステータスを 'ready' にする (PUT /tournaments/{id}/battle/ready)
 */
export async function setParticipantReady(tournamentId: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${tournamentId}/battle/ready`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 参加者のステータスを 'pending' (キャンセル) にする (PUT /tournaments/{id}/battle/cancel)
 */
export async function setParticipantCancel(tournamentId: string) {
    const response = await fetch(`${SERVERURL}/tournaments/${tournamentId}/battle/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}