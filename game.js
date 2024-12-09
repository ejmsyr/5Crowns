const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
let currentPlayerIndex = 0; // Tracks the current player's turn
function generateDeck() {
    const suits = ['S', 's', 'C', 'D', 'H']; // Suits: Spades, Clubs, Diamonds, Hearts
    const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J']; // Ranks: Cards from 3 to Joker
    let deck = [];

    // Generate unique cards
    for (let suit of suits) {
        for (let rank of ranks) {
            const card = `${suit}${rank}`;
            deck.push(card); // Add each unique card
            deck.push(card); // Add duplicate
        }
    }
    return deck;
}

// Function to initialize the deck in localStorage
function initializeDeck() {
    if (!localStorage.getItem("deck")) {
        const deck = generateDeck();
        localStorage.setItem("deck", JSON.stringify(deck));
        console.log("Deck initialized:", deck);
    }
}
// Function to pick a random starting player
function pickRandomPlayer(plAr) {
    return Math.floor(Math.random() * plAr.length);
}

// Function to update the turn indicator
function updateTurnIndicator(plAr) {
    const turnIndicator = document.getElementById("turn-indicator");
    if (turnIndicator) {
        turnIndicator.textContent = `${plAr[currentPlayerIndex]}'s Turn`;
        console.log(plAr[currentPlayerIndex])
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
    initializeDeck();
   // const plAr = JSON.parse(localStorage.getItem("playerArray")) || []; // Fallback players
    currentPlayerIndex = pickRandomPlayer(plAr); // Start with a random player
    updateTurnIndicator(plAr);

    // Switch to the next player on click
    document.body.addEventListener("click", () => {
        switchToNextPlayer(plAr);
        console.log(plAr);
        console.log(plAr[currentPlayerIndex]);
    });
});


class PlayingCard {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    // Generate the card HTML element
    generateCardElement() {
        const card = document.createElement('div');
        card.classList.add('playing-card', `suit-${this.suit}`);
        card.innerHTML = `
            <div class="card-corner top-left">${this.rank}</div>
            <div class="card-symbol">${this.getSuitSymbol()}</div>
            <div class="card-corner bottom-right">${this.rank}</div>
        `;
        return card;
    }

    // Get the visual symbol for the suit
    getSuitSymbol() {
        const symbols = {
            S: '♠', // Spades
            s: '★', // Golden Star
            C: '♣', // Clubs
            D: '♦', // Diamonds
            H: '♥', // Hearts
        };
        return symbols[this.suit] || '';
    }
}

// Export a function to create cards dynamically
function createCard(suit, rank) {
    const card = new PlayingCard(suit, rank);
    return card.generateCardElement();
}
