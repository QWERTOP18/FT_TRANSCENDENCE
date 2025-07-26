const USER_ID_KEY = 'user_id';

/**
 * ユーザーIDをlocalStorageに保存する
 * @param id 保存するユーザーID
 */
export function saveUserId(id: string): void {
    localStorage.setItem(USER_ID_KEY, id);
    console.log(`User ID saved: ${id}`);
}

/**
 * localStorageからユーザーIDを取得する
 * @returns ユーザーID、または存在しない場合はnull
 */
export function getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
}

/**
 * 認証ヘッダーを含むヘッダーオブジェクトを生成する
 * @returns HeadersInitオブジェクト
 */
export function getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const userId = getUserId();
    if (userId) {
        // バックエンドが期待するヘッダー形式に合わせる。
        // ここでは仮に 'Authorization': 'Bearer <user_id>' とする。
        headers['Authorization'] = `Bearer ${userId}`;
    }
    return headers;
}
