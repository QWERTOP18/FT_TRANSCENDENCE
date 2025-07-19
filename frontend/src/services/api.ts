import { TOURNAMENT_URL } from '../config';

export async function findMatch() {
    try {
        const response = await fetch('http://localhost:4000/ready', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: `user-${Math.random()}` }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function getTournaments() {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/api/tournament`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch tournaments:", error);
        throw error;
    }
}

export async function getTournamentById(id: string) {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/api/tournament/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch tournament with id ${id}:`, error);
        throw error;
    }
}

export async function openTournament(id: string) {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/api/tournament/${id}/open`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to open tournament with id ${id}:`, error);
        throw error;
    }
}
