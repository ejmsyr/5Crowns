const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
let currentPlayerIndex = 0;
let lastDiscardedCard = null;

function generateDeck() {
    const suits = ['S', 's', 'C', 'D', 'H'];
    const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            const card = `${suit}${rank}`;
            deck.push(card); // Add unique card
            deck.push(card); // Add duplicate
        }
    }
    return deck;
}

function initializeDeck(forceReset = false) {
    if (forceReset || !localStorage.getItem("deck")) {
        const deck = generateDeck();
        localStorage.setItem("deck", JSON.stringify(deck));
        console.log("Deck initialized:", deck);
    } else {
        console.log("Deck already exists in localStorage.");
    }
}

function pickRandomPlayer(players) {
    return Math.floor(Math.random() * players.length);
}

function updateTurnIndicator(players) {
    const gameState = getGameState();
    const turnIndicator = document.getElementById("turn-indicator");
    if (turnIndicator) {
        turnIndicator.textContent = `${players[gameState.currentPlayerIndex]}'s Turn`;
        console.log(`${players[gameState.currentPlayerIndex]}'s Turn`);
    } else {
        console.error("Turn indicator not found.");
    }
}


function initializePlayerHands(players) {
    const hands = {};
    players.forEach(player => {
        hands[player] = [];
    });
    localStorage.setItem("playerHands", JSON.stringify(hands));
    console.log("Player hands initialized:", hands);
}

function dealCardsToPlayer(player, cardCount) {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};

    for (let i = 0; i < cardCount; i++) {
        if (deck.length === 0) {
            console.error("Deck is empty!");
            break;
        }
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck.splice(randomIndex, 1)[0];
        hands[player].push(card);
    }

    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("playerHands", JSON.stringify(hands));
}

function discardCard(player, card) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    const deck = JSON.parse(localStorage.getItem("deck")) || [];

    if (!hands[player]) {
        console.error(`Player ${player} not found in hands.`);
        return;
    }

    const cardIndex = hands[player].indexOf(card);
    if (cardIndex !== -1) {
        hands[player].splice(cardIndex, 1); // Remove the card from the player's hand
    } else {
        console.error(`Card ${card} not found in ${player}'s hand.`);
    }

    if (lastDiscardedCard) {
        deck.push(lastDiscardedCard); // Return the previous discarded card to the deck
    }

    lastDiscardedCard = card; // Update the last discarded card
    localStorage.setItem("discardPile", JSON.stringify(lastDiscardedCard));
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("playerHands", JSON.stringify(hands));
}


function drawCard(player) {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    if (deck.length === 0) {
        console.error("Deck is empty!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];
    hands[player].push(card);
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("playerHands", JSON.stringify(hands));
}

function updateDiscardVisual() {
    const discardButton = document.getElementById('discard');
    discardButton.innerHTML = '';
    if (lastDiscardedCard) {
        const [suit, rank] = [lastDiscardedCard[0], lastDiscardedCard.slice(1)];
        const cardElement = createCard(suit, rank);
        discardButton.appendChild(cardElement);
    } else {
        const placeholder = document.createElement('div');
        placeholder.classList.add('playing-card', 'card-back');
        discardButton.appendChild(placeholder);
    }
}

function initializeDiscardPile() {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    if (deck.length === 0) {
        console.error("Deck is empty!");
        return;
    }
    const randomIndex = Math.floor(Math.random() * deck.length);
    lastDiscardedCard = deck.splice(randomIndex, 1)[0];
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("discardPile", JSON.stringify(lastDiscardedCard));
    updateDiscardVisual();
}

function initializeGameState() {
    const defaultState = { currentPlayerIndex: 0, drawMode: true };
    const gameState = JSON.parse(localStorage.getItem("gameState")) || defaultState;
    localStorage.setItem("gameState", JSON.stringify(gameState));
    return gameState;
}

function updateGameState(updates) {
    const gameState = JSON.parse(localStorage.getItem("gameState")) || {};
    const updatedState = { ...gameState, ...updates };
    localStorage.setItem("gameState", JSON.stringify(updatedState));
    return updatedState;
}

function getGameState() {
    return JSON.parse(localStorage.getItem("gameState")) || {};
}

document.addEventListener("DOMContentLoaded", () => {
    const newCardButton = document.getElementById('new-card');
    const discardButton = document.getElementById('discard');
    const gameState = initializeGameState();

    initializeDeck(true);
    initializePlayerHands(plAr);
    initializeDiscardPile();
    updateTurnIndicator(plAr);

    plAr.forEach(player => dealCardsToPlayer(player, 5));
    displayPlayerHand(plAr[gameState.currentPlayerIndex]);

    newCardButton.addEventListener('click', () => {
        const { currentPlayerIndex, drawMode } = getGameState();
        const currentPlayer = plAr[currentPlayerIndex];

        if (drawMode) {
            drawCard(currentPlayer);
            updateGameState({ drawMode: false });
            displayPlayerHand(currentPlayer);
        }
    });

    discardButton.addEventListener('click', () => {
        const { currentPlayerIndex, drawMode } = getGameState();
        const currentPlayer = plAr[currentPlayerIndex];
        const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    
        if (drawMode) {
            // Draw the previously discarded card
            const discardedCard = JSON.parse(localStorage.getItem("discardPile"));
            if (discardedCard) {
                hands[currentPlayer].push(discardedCard); // Add to the player's hand
                lastDiscardedCard = null; // Clear the discard pile
                localStorage.setItem("playerHands", JSON.stringify(hands));
                localStorage.setItem("discardPile", null); // Clear discard cache
                updateGameState({ drawMode: false });
                updateDiscardVisual();
                displayPlayerHand(currentPlayer);
            } else {
                console.error("No card available in the discard pile!");
            }
        } else {
            // Discard a random card from the player's hand
            const randomIndex = Math.floor(Math.random() * hands[currentPlayer].length);
            const discardedCard = hands[currentPlayer].splice(randomIndex, 1)[0];
            discardCard(currentPlayer, discardedCard);
            updateDiscardVisual();
    
            // Switch to the next player
            const nextPlayerIndex = (currentPlayerIndex + 1) % plAr.length;
            updateGameState({ currentPlayerIndex: nextPlayerIndex, drawMode: true });
            updateTurnIndicator(plAr);
            displayPlayerHand(plAr[nextPlayerIndex]);
        }
    });
    
});

// PlayingCard class
class PlayingCard {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

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

function createCard(suit, rank) {
    const card = new PlayingCard(suit, rank);
    return card.generateCardElement();
}
function initializeGameState() {
    const defaultState = {
        currentPlayerIndex: 0,
        drawMode: true, // Indicates whether the player is allowed to draw
    };
    const gameState = JSON.parse(localStorage.getItem("gameState")) || defaultState;
    localStorage.setItem("gameState", JSON.stringify(gameState));
    return gameState;
}

function updateGameState(updates) {
    const gameState = JSON.parse(localStorage.getItem("gameState")) || {};
    const updatedState = { ...gameState, ...updates };
    localStorage.setItem("gameState", JSON.stringify(updatedState));
    return updatedState;
}

function getGameState() {
    return JSON.parse(localStorage.getItem("gameState")) || {};
}

function displayPlayerHand(player) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    const playerHandContainer = document.getElementById('player-hand');

    if (!hands[player]) {
        console.error(`Player ${player} not found in hands.`);
        return;
    }

    playerHandContainer.innerHTML = ''; // Clear the current hand display
    hands[player].forEach(card => {
        const [suit, rank] = [card[0], card.slice(1)];
        const cardElement = createCard(suit, rank);
        playerHandContainer.appendChild(cardElement);
    });
}