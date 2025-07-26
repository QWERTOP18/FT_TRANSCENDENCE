function render(appElement: HTMLElement, content: string) {
    appElement.innerHTML = content;
}

export function renderSignupScreen(appElement: HTMLElement) {
    const content = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white max-w-md mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Sign Up</h2>
            <form onsubmit="window.router.handleSignup(event)">
                <div class="mb-4">
                    <label for="signup-name" class="block text-sm font-medium text-gray-300 mb-1">User Name</label>
                    <input type="text" id="signup-name" name="name" required class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold">
                    Create User & Sign In
                </button>
            </form>
        </div>
    `;
    render(appElement, content);
}
