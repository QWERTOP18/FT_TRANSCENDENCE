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
    const userId = localStorage.getItem(USER_ID_KEY);
    console.log("getUserId() called, returning:", userId);
    return userId;
}

/**
 * ログアウト処理を行う
 * localStorageからユーザーIDを削除する
 */
export function logout(): void {
    localStorage.removeItem(USER_ID_KEY);
    console.log("User logged out, user ID removed from localStorage");
    window.location.reload();
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
        headers['x-user-id'] = userId; // ヘッダー名を 'x-user-id' に変更
    }
    return headers;
}

