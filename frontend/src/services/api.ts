import { TOURNAMENT_URL, GAME_URL, SERVERURL } from '../config';
import { getAuthHeaders, saveUserId } from './auth';

export async function signup(name: string) {
    try {
        // バックエンドのAuthサービスのエンドポイントを叩く
        const response = await fetch(`${SERVERURL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            // エラーレスポンスもJSON形式の可能性があるため、内容を読み取る
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        if (data.id) {
            // 成功レスポンスにIDが含まれていれば、localStorageに保存
            saveUserId(data.id);
        }
        return data;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
}

/**
 * マッチメイキングキューに参加する
 */
export async function findMatch() {
    try {
        const response = await fetch(`${GAME_URL}/ready`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: `user-${Math.random()}` }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * トーナメント一覧を取得する (GET /tournaments)
 */
export async function getTournaments() {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 新しいトーナメントを作成する (POST /tournaments)
 */
export async function createTournament(data: { name: string, description: string }) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments`, {
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
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * トーナメントを開始（オープン）状態にする (PUT /tournaments/{id}/open)
 */
export async function openTournament(id: string) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}/open`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * トーナメントに参加者を追加する (POST /tournaments/{id}/participants)
 */
export async function joinTournament(tournamentId: string, userId: string) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/participants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId }), // APIの仕様に合わせて body を調整
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 参加者のステータスを 'ready' にする
 */
export async function setParticipantReady(tournamentId: string, participantId: string) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/participants/${participantId}/ready`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 参加者のステータスを 'pending' (キャンセル) にする
 */
export async function setParticipantCancel(tournamentId: string, participantId: string) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/participants/${participantId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 対戦結果を作成（報告）する (POST /tournaments/{id}/histories)
 */
export async function createHistory(tournamentId: string, battleResult: any) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/histories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(battleResult),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * バトルを開始する (PUT /tournaments/{id}/battle/start)
 */
export async function startBattle(tournamentId: string) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/battle/start`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

/**
 * 対戦を終了する (POST /tournaments/{id}/battle/end)
 */
export async function endBattle(tournamentId: string, result: any) {
    const response = await fetch(`${TOURNAMENT_URL}/tournaments/${tournamentId}/battle/end`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(result),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

// export async function updateTournament(id: string, data: { name: string; description: string; max_participants: number; }) {
//     try {
//         const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}`, {
//             method: 'PUT',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(data),
//         });
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Failed to update tournament with id ${id}:`, error);
//         throw error;
//     }
// }
