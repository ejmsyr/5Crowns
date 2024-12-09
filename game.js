const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
let currentPlayerIndex = 0;
let lastDiscardedCard = null;
let selectedCardIndex = null; // Tracks the index of the selected card


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
    discardButton.innerHTML = ''; // Clear existing content

    if (lastDiscardedCard) {
        // If a card is present, display it
        const [suit, rank] = [lastDiscardedCard[0], lastDiscardedCard.slice(1)];
        const cardElement = createCard(suit, rank);
        discardButton.classList.add('card-present'); // Mark discard pile as having a card
        discardButton.appendChild(cardElement);
    } else {
        // No card in the discard pile, show empty state
        discardButton.classList.remove('card-present'); // Remove card-present style
        const placeholder = document.createElement('div');
        placeholder.textContent = ''; // Leave it empty for now
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
    const defaultState = {
        currentPlayerIndex: pickRandomPlayer(plAr), // Randomly pick the starting player
        drawMode: true, // Ensure draw mode starts as true
    };

    const gameState = JSON.parse(localStorage.getItem("gameState")) || defaultState;
    localStorage.setItem("gameState", JSON.stringify(gameState)); // Save the game state
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
    
    const gameState = initializeGameState();
    const newCardButton = document.getElementById('new-card');
    const discardButton = document.getElementById('discard');

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
        }else {
            console.error("You have already drawn this turn! Please discard a card.");
        }
    });

    discardButton.addEventListener('click', () => {
        const { currentPlayerIndex, drawMode } = getGameState();
        const currentPlayer = plAr[currentPlayerIndex];
        const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
        const selectedCard = JSON.parse(localStorage.getItem("selectedCard"));
    
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
            if (selectedCard) {
                // Remove selected card from hand and discard it
                const cardIndex = hands[currentPlayer].indexOf(selectedCard);
                if (cardIndex !== -1) {
                    hands[currentPlayer].splice(cardIndex, 1);
                    discardCard(currentPlayer, selectedCard);
                    updateDiscardVisual();
                    localStorage.setItem("playerHands", JSON.stringify(hands));
                    localStorage.removeItem("selectedCard");
    
                    // Switch to the next player
                    const nextPlayerIndex = (currentPlayerIndex + 1) % plAr.length;
                    updateGameState({ currentPlayerIndex: nextPlayerIndex, drawMode: true });
                    updateTurnIndicator(plAr);
                    displayPlayerHand(plAr[nextPlayerIndex]);
                } else {
                    console.error("Selected card not found in player's hand.");
                }
            } else {
                console.error("No card selected for discard!");
            }
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
    if (!hands[player]) {
        console.error(`Player ${player} not found in hands.`);
        return;
    }

    setupCardSelection(player); // Set up click listeners for selection
}

function setupCardSelection(player) {
    const playerHandContainer = document.getElementById('player-hand');
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    let selectedCard = JSON.parse(localStorage.getItem("selectedCard")); // Get selected card from cache

    if (!hands[player]) {
        console.error(`Player ${player} not found in hands.`);
        return;
    }

    playerHandContainer.innerHTML = ''; // Clear the current hand display

    hands[player].forEach((card, index) => {
        const [suit, rank] = [card[0], card.slice(1)];
        const cardElement = createCard(suit, rank);

        // Highlight if this card matches the selected card
        if (selectedCard === card) {
            cardElement.classList.add('selected-card');
        }

        // Add click event for card selection/swapping
        cardElement.addEventListener('click', () => {
            if (!selectedCard) {
                // No card is selected, select this card
                selectedCard = card;
                localStorage.setItem("selectedCard", JSON.stringify(selectedCard));
                cardElement.classList.add('selected-card');
                console.log(`Selected card: ${selectedCard}`);
            } else if (selectedCard === card) {
                // If the same card is clicked, deselect it
                selectedCard = null;
                localStorage.removeItem("selectedCard");
                cardElement.classList.remove('selected-card');
                console.log("Deselected card.");
            } else {
                // Swap the selected card with this card
                const selectedIndex = hands[player].indexOf(selectedCard);
                if (selectedIndex !== -1) {
                    console.log(`Swapping ${selectedCard} with ${card}`);
                    hands[player][selectedIndex] = card;
                    hands[player][index] = selectedCard;

                    // Update hands and cache
                    localStorage.setItem("playerHands", JSON.stringify(hands));
                    localStorage.removeItem("selectedCard"); // Clear selection after swap

                    // Re-render the hand
                    setupCardSelection(player);
                } else {
                    console.error("Selected card not found in player's hand.");
                }
            }
        });

        playerHandContainer.appendChild(cardElement);
    });
}


// Add styling for selected card
document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
        .selected-card {
            border: 3px solid gold;
            box-shadow: 0 0 10px gold;
        }
    </style>`
);
