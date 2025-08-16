import { test, expect } from '@playwright/test';

test('時間ベースの一意なユーザー名でサインアップしてテスト', async ({ page }) => {
  // 現在のタイムスタンプを取得して一意なユーザー名を生成
  const timestamp = Date.now();
  const uniqueUsername = `testuser_${timestamp}`;
  
  console.log(`Generated unique username: ${uniqueUsername}`);
  
  await page.goto('http://localhost:3000/signup');
  
  // 一意なユーザー名を入力
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill(uniqueUsername);
  await page.getByRole('textbox', { name: 'User Name' }).press('Enter');
  
  // サインアップ処理
  page.once('dialog', dialog => {
    console.log(`Signup dialog: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.goto('http://localhost:3000/login');

  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill(uniqueUsername);
  await page.getByRole('textbox', { name: 'User Name' }).press('Enter');
  
  // トーナメント作成
  await page.getByRole('button', { name: 'Create Tournament' }).click();
  await page.getByRole('textbox', { name: 'Tournament Name' }).click();
  await page.getByRole('textbox', { name: 'Tournament Name' }).fill(`tournament_${timestamp}`);
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill(`Test tournament created at ${new Date(timestamp).toISOString()}`);
  
  page.once('dialog', dialog => {
    console.log(`Tournament creation dialog: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: '作成する' }).click();
  await page.getByRole('button', { name: '🏠 Home' }).click();
  

  
  // ログアウト
  page.once('dialog', dialog => {
    console.log(`Logout dialog: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  
  await page.getByRole('button', { name: '🚪 Logout' }).click();
  
  // ログアウト確認ダイアログ
  page.once('dialog', dialog => {
    console.log(`Logout confirmation dialog: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
});
