const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
//console.log(plAr);
let currentPlayerIndex = 0; // Tracks the current player's turn

// Function to pick a random starting player
function pickRandomPlayer(plAr) {
    return Math.floor(Math.random() * plAr.length);
}

// Function to update the turn indicator
function updateTurnIndicator(plAr) {
    const turnIndicator = document.getElementById("turn-indicator");
    if (turnIndicator) {
        turnIndicator.textContent = `${pickRandomPlayer[currentPlayerIndex]}'s Turn`;
    } else {
        console.error("Turn indicator element not found.");
    }
}

// Function to handle the turn switch
function switchToNextPlayer(players) {
    currentPlayerIndex = (currentPlayerIndex + 1) % plAr.length; // Loop back to the beginning
    updateTurnIndicator(plAr);
}

// Initialize the gameplay turn logic
document.addEventListener("DOMContentLoaded", () => {
    if (document.title === "5 Crowns - Gameplay") {
        const playerArray = JSON.parse(localStorage.getItem("playerArray")) || []; // Fallback players
        currentPlayerIndex = pickRandomPlayer(playerArray); // Start with a random player
        updateTurnIndicator(playerArray);

        // Switch to the next player on click
        document.body.addEventListener("click", () => {
            switchToNextPlayer(playerArray);
            console.log(playerArray);
            console.log(plAr[currentPlayerIndex]);
        });
    }
});
