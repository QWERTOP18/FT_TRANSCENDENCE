/**
 * 文字列内のHTML特殊文字をエスケープする
 * @param str エスケープする文字列
 * @returns エスケープ後の安全な文字列
 */

export function escapeHTML(str: string | null | undefined): string {
    if (str === null || str === undefined) {
        return '';
    }
    // 一時的なDOM要素を作成
    const div = document.createElement('div');
    
    // textContentとして設定することで、HTMLタグはすべて無効化（ただの文字列）される
    div.textContent = str;
    
    // innerHTMLとして読み出すことで、特殊文字がHTMLエンティティに変換される
    return div.innerHTML;
}