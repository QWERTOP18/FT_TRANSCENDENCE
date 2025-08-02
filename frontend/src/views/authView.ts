function render(appElement: HTMLElement, content: string): void {
    appElement.innerHTML = content;
}

/**
 * サインアップ画面を描画する
 */
export function renderSignupScreen(appElement: HTMLElement): void {
    const contentHTML = `
        <div class="metallic-card p-8 rounded-lg text-white max-w-md mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Sign Up</h2>
            <form onsubmit="window.router.handleSignup(event)">
                <div class="mb-4">
                    <label for="signup-name" class="block text-sm font-medium text-gray-300 mb-1">User Name</label>
                    <input type="text" id="signup-name" name="name" required class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full mt-4 px-4 py-2 metallic-button-green rounded text-white font-bold">
                    Create User
                </button>
            </form>
        </div>
    `;
    render(appElement, contentHTML);
}

/**
 * ログイン画面を描画する
 */
export function renderLoginScreen(appElement: HTMLElement): void {
    const contentHTML = `
        <div class="metallic-card p-8 rounded-lg text-white max-w-md mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Login</h2>
            <form onsubmit="window.router.handleLogin(event)">
                <div class="mb-4">
                    <label for="login-name" class="block text-sm font-medium text-gray-300 mb-1">User Name</label>
                    <input type="text" id="login-name" name="name" required class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full mt-4 px-4 py-2 metallic-button-blue rounded text-white font-bold">
                    Sign In
                </button>
            </form>
             <p class="text-center text-sm text-gray-400 mt-4">
                アカウントがありませんか？ 
                <a href="#" class="text-blue-400 hover:underline" onclick="window.router.navigateTo('/signup')">サインアップ</a>
            </p>
        </div>
    `;
    render(appElement, contentHTML);
}
