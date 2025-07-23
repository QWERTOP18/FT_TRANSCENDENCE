import { TOURNAMENT_URL, GAME_URL } from '../config';

const AUTH_TOKEN = "your-secret-auth-token-here"; 

const tournamentApiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
};

export async function findMatch() {
    try {
        const response = await fetch(`${GAME_URL}/ready`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: `user-${Math.random()}` }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export async function getTournaments() {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/tournaments`, { 
            headers: tournamentApiHeaders 
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch tournaments:", error);
        throw error;
    }
}

export async function getTournamentById(id: string) {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}`, { 
            headers: tournamentApiHeaders 
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch tournament with id ${id}:`, error);
        throw error;
    }
}

export async function openTournament(id: string) {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}/open`, {
            method: 'PUT',
            headers: tournamentApiHeaders,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to open tournament with id ${id}:`, error);
        throw error;
    }
}

export async function updateTournament(id: string, data: { name: string; description: string; max_participants: number; }) {
    try {
        const response = await fetch(`${TOURNAMENT_URL}/tournaments/${id}`, {
            method: 'PUT',
            headers: tournamentApiHeaders,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to update tournament with id ${id}:`, error);
        throw error;
    }
}
