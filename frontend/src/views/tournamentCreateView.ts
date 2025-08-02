import { render } from './tournamentView';

export function renderCreateTournamentScreen(appElement: HTMLElement): void {
    const contentHTML = `
        <div class="bg-gray-800 bg-opacity-80 p-8 rounded-lg text-white w-full max-w-lg mx-auto">
            <h2 class="text-3xl font-bold text-center mb-6">Create New Tournament</h2>
            <form onsubmit="window.router.handleCreateTournament(event)">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Tournament Name</label>
                    <input type="text" id="name" name="name" required class="w-full bg-gray-700 rounded px-3 py-2">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="description" name="description" rows="3" class="w-full bg-gray-700 rounded px-3 py-2"></textarea>
                </div>
                <div class="mb-4">
                    <label for="max_num" class="block text-sm font-medium text-gray-300 mb-1">Max Participants</label>
                    <input type="number" id="max_num" name="max_num" value="2" min="2" required class="w-full bg-gray-700 rounded px-3 py-2">
                </div>
                <div class="mb-6">
                    <label for="rule" class="block text-sm font-medium text-gray-300 mb-1">Rule</label>
                    <select id="rule" name="rule" class="w-full bg-gray-700 rounded px-3 py-2">
                        <option value="simple">Simple</option>
                    </select>
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold">作成する</button>
            </form>
        </div>
    `;
    render(appElement, contentHTML);
} 
