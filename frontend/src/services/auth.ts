// localStorageに保存する際のキー名を定数として定義
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
 * 認証ヘッダーを含むヘッダーオブジェクトを動的に生成する
 * @returns HeadersInitオブジェクト
 */
export function getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const userId = getUserId();
    if (userId) {
        // バックエンドが期待するヘッダー形式に合わせてください。
        // ここでは仮にユーザーIDをBearerトークンとして送ります。
        headers['Authorization'] = `Bearer ${userId}`;
    }
    return headers;
}

/**
 * ログアウト処理（localStorageからユーザーIDを削除）
 */
// export function logout(): void {
//     localStorage.removeItem(USER_ID_KEY);
//     console.log('Logged out, user ID removed.');
// }