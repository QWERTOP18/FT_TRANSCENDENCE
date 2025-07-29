import { test, expect } from '@playwright/test';

test('test', async ({ page, browser }) => {
    // Chromiumで新しいコンテキスト・ページを作成
    const context = await browser.newContext();
    const chromiumPage = await context.newPage();
    await chromiumPage.goto('http://localhost:3000/tournaments');
    await chromiumPage.getByRole('button', { name: 'Signup' }).click();
    await chromiumPage.getByRole('textbox', { name: 'User Name' }).click();
    await chromiumPage.getByRole('textbox', { name: 'User Name' }).fill('kotaro2');
    chromiumPage.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await chromiumPage.getByRole('button', { name: 'Create User & Sign In' }).click();
    await chromiumPage.locator('html').click();
    await chromiumPage.getByText('My Pong Game Game Tournaments Matchmaking Admin Signup Tournament List 新規作成').press('Alt+ControlOrMeta+∆');
    // 実際の画面を表示（PlaywrightのAPIでスクリーンショット保存例）
    await chromiumPage.screenshot({ path: 'screen.png', fullPage: true });
    // ...既存のpage操作は必要なら残す...
});


