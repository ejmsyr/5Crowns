// Simulating player data from login
const players = []; // Replace with dynamically retrieved usernames

// Function to update the players in the lobby
function updatePlayersLobby() {
    const playersLobby = document.getElementById("playersLobby");

    // Retrieve the player array from localStorage
    const playerArray = JSON.parse(localStorage.getItem("playerArray")) || [];

    if (playersLobby) {
        playersLobby.innerHTML = `Players in lobby: ${playerArray.join(", ")}`;
    } else {
        console.error("Element with ID 'players-lobby' not found.");
    }
}

// Wait for the DOM to load before updating players
//document.addEventListener("DOMContentLoaded", updatePlayersLobby(players));

document.addEventListener("DOMContentLoaded", () => {
    if (document.title === "5 Crowns - Welcome") {
        updatePlayersLobby(players);
        // Select the Start Game button
        const startGameButton = document.getElementById("start-game-button");

        if (startGameButton) {
            // Add click event listener
            startGameButton.addEventListener("click", () => {
                // Redirect to the game page
                window.location.href = "gameplay.html"; // Replace 'gameplay.html' with your target page
            });
        } else {
            console.error("Start Game button not found.");
        }
    } else {
        localStorage.clear();
        const defaultPlayer = ["Trace"];
        localStorage.setItem("playerArray", JSON.stringify(defaultPlayer));
        console.log("Player array reset to:", defaultPlayer);
        document.getElementById('login-btn').addEventListener('click', function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (password === "1" && username != "") {
                let playerArray = JSON.parse(localStorage.getItem("playerArray")) || [];
                playerArray.push(username);


                localStorage.setItem("playerArray", JSON.stringify(playerArray));


                window.location.href = 'game.html';

            } else {
                alert("Invalid Password")
            }
        });
    }
});