

const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
//console.log(plAr);
let currentPlayerIndex = 0; // Tracks the current player's turn
async function fetchTableData() {
    try {
        const response = await fetch('http://192.168.1.44/api.php?action=read');
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
async function updateScore(id, newScore) {
    try {
        const response = await fetch('http://192.168.1.44/api.php?action=update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, score: newScore }),
        });
        const result = await response.json();
        console.log('Update result:', result);
    } catch (error) {
        console.error('Error updating score:', error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchTableData();

    // Display fetched data in the console
    console.log('Initial Data:', data);

    document.body.addEventListener("click", () => {
        if (data.length > 0) {
            const player = data[0]; // Example: Work with the first player
            const newScore = Math.floor(Math.random() * 100); // Random new score for testing
            console.log(`Updating player ${player.id} score to ${newScore}`);
            updateScore(player.id, newScore);
        }
    });
});
