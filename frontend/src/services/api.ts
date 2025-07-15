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
        throw error; // エラーを呼び出し元に伝える
    }
}
