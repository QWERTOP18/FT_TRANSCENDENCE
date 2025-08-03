import i18next from 'i18next';
import translationEN from '../public/locales/en.json';
import translationJA from '../public/locales/ja.json';
import translationKR from '../public/locales/kr.json';

i18next.init({
    // ブラウザの言語設定を取得し、'ja-JP'などを'ja'に変換
    lng: navigator.language.split('-')[0], 
    fallbackLng: 'en', // もし言語が見つからなければ英語をデフォルトにする
    resources: {
        en: {
            translation: translationEN
        },
        ja: {
            translation: translationJA
        },
        kr: {
            translation: translationKR
        }
    },
    interpolation: {
        escapeValue: false
    }
});

/**
 * 翻訳を取得するための関数
 * t('key') のようにして使う
 */
export const t = i18next.t.bind(i18next);

export function changeLanguage(lang: 'ja' | 'en') {
    i18next.changeLanguage(lang, () => {
        // 言語が変更された後、アプリケーション全体を再描画するために
        // routerのhandleLocationを呼び出す
        (window as any).router.handleLocation(); 
    });
}
