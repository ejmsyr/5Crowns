const plAr = JSON.parse(localStorage.getItem("playerArray")) || [];
let currentPlayerIndex = 0;
let lastDiscardedCard = null;
let selectedCardIndex = null; // Tracks the index of the selected card
let cardIdCounter = 0; // Global counter for unique card IDs

//Deck

function generateDeck() {
    const suits = ['S', 's', 'C', 'D', 'H'];
    const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({
                id: `${cardIdCounter++}`,
                value: `${suit}${rank}`
            }); // Original card
            deck.push({
                id: `${cardIdCounter++}`,
                value: `${suit}${rank}`
            }); // Duplicate card
        }
    }
    return deck;
}
function initializeDeck() {
        const deck = generateDeck();
        localStorage.setItem("deck", JSON.stringify(deck));
        console.log("Deck initialized:", deck);

}

//Cards

function initializeDiscard() {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    // Draw a card from the deck to initialize the discard pile
    lastDiscardedCard = deck.splice(Math.floor(Math.random()*deck.length),1)[0];
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("discard", JSON.stringify(lastDiscardedCard)); // Initialize discard pile as array
    console.log(lastDiscardedCard);
    updateDiscardVisual();
}
function updateDiscardVisual() {
    const discardButton = document.getElementById('discard');
    discardButton.innerHTML = ''; // Clear existing content

    if (lastDiscardedCard) {
        // Access the card object directly
        const { value, id } = lastDiscardedCard;
        const [suit, rank] = [value[0], value.slice(1)];
        const cardElement = createCard(suit, rank, id);
        discardButton.classList.add('card-present'); // Mark discard pile as having a card
        discardButton.appendChild(cardElement);
    } else {
        // No card in the discard pile, show empty state
        discardButton.classList.remove('card-present'); // Remove card-present style
        const placeholder = document.createElement('div');
        discardButton.appendChild(placeholder);
    }
}
function createCard(suit, rank, id) {
    const card = new PlayingCard(suit, rank).generateCardElement();
    card.setAttribute('data-card-id', id); // Assign unique ID
    card.setAttribute('data-card', `${suit}${rank}`); // Assign rank and suit
    return card;
}
function setupCardSelection(player) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    let selectedCardId = localStorage.getItem("selectedCardId");

    const playerHandContainer = document.getElementById('player-hand');
    if (!playerHandContainer) {
        console.error("Player hand container not found.");
        return;
    }
    if (!hands[player]) {
        console.error(`No hand found for player: ${player}`);
        return;
    }

    // Clear and re-render the player's hand
    playerHandContainer.innerHTML = '';

    hands[player].forEach((card, index) => {
        const { id, value } = card;
        const [suit, rank] = [value[0], value.slice(1)];
        const cardElement = createCard(suit, rank, id);

        // Highlight the selected card
        if (selectedCardId === id) {
            cardElement.classList.add('selected-card');
        }

        // Add click listener for selection and switching
        cardElement.onclick = () => {
            if (selectedCardId === id) {
                // Deselect if clicked again
                selectedCardId = null;
                localStorage.removeItem("selectedCardId");
                cardElement.classList.remove('selected-card');
                console.log("Card deselected.");
            } else if (selectedCardId) {
                // Switch with the previously selected card
                const selectedCardIndex = hands[player].findIndex(c => c.id === selectedCardId);
                if (selectedCardIndex !== -1) {
                    // Swap the cards in the hand
                    [hands[player][selectedCardIndex], hands[player][index]] =
                        [hands[player][index], hands[player][selectedCardIndex]];

                    // Save the updated hands and reset selection
                    localStorage.setItem("playerHands", JSON.stringify(hands));
                    selectedCardId = null;
                    localStorage.removeItem("selectedCardId");
                    console.log(`Switched cards: ${hands[player][selectedCardIndex]} with ${hands[player][index]}`);

                    // Refresh visuals after swapping
                    checkMeld(player,0,0,0);
                    setupCardSelection(player);
                }
            } else {
                // Select the clicked card
                selectedCardId = id;
                localStorage.setItem("selectedCardId", selectedCardId);

                // Highlight the selected card
                playerHandContainer.querySelectorAll('.playing-card').forEach(el => el.classList.remove('selected-card'));
                cardElement.classList.add('selected-card');
                console.log(`Card selected: ${selectedCardId}`);
            }
        };

        // Append the card element to the container
        playerHandContainer.appendChild(cardElement);
    });
}
function discardCard(player) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    const selectedCardId = localStorage.getItem("selectedCardId");

    if (!hands[player]) {
        console.error(`Player ${player} not found.`);
        return;
    }
    if (!selectedCardId) {
        console.error("No card selected for discard!");
        return;
    }

    // Find the selected card in the player's hand
    const cardIndex = hands[player].findIndex(card => card.id === selectedCardId);
    if (cardIndex === -1) {
        console.error("Selected card not found in player's hand.");
        return;
    }

    const [discardedCard] = hands[player].splice(cardIndex, 1); // Remove the card from the hand
    lastDiscardedCard = discardedCard; // Update the last discarded card

    // Update localStorage
    localStorage.setItem("playerHands", JSON.stringify(hands));
    localStorage.setItem("discard", JSON.stringify(lastDiscardedCard));
    localStorage.removeItem("selectedCardId"); // Clear the selected card
    updateDiscardVisual(); // Update the discard pile visuals
    console.log(`Player ${player} discarded card:`, discardedCard);
}

//Drawing

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
function dealCardsToPlayer(player, cardCount) {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};

    if (!hands[player]) {
        hands[player] = []; // Initialize the player's hand if it doesn't exist
    }

    for (let i = 0; i < cardCount; i++) {
        if (deck.length === 0) {
            console.error("Deck is empty!");
            break;
        }
        const card = deck.splice(Math.floor(Math.random()*deck.length),1)[0]; // Get the top card from the deck
        hands[player].push(card); // Add the card to the player's hand
    }

    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("playerHands", JSON.stringify(hands));
    console.log(`Dealt ${cardCount} cards to ${player}:`, hands[player]);
}
function drawCard(player) {
    const deck = JSON.parse(localStorage.getItem("deck")) || [];
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};

    if (!hands[player]) {
        hands[player] = [];
        console.log("HELP");
    }

    if (deck.length === 0) {
        console.error("Deck is empty!");
        return;
    }

    const card = deck.splice(Math.floor(Math.random()*deck.length),1)[0];
    hands[player].push(card);

    // Clear selection state
    //localStorage.removeItem("selectedCardId");

    // Update localStorage
    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("playerHands", JSON.stringify(hands));
    console.log(`Player ${player} drew a card:`, card);
    checkMeld(player,1,0);
    // Refresh hand display
    setupCardSelection(player);
}
function drawFromDiscard(player) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    const discard = JSON.parse(localStorage.getItem("discard"));

    if (!hands[player]) {
        hands[player] = [];
    }

    if (!discard || Object.keys(discard).length === 0) {
        console.error("Discard pile is empty!");
        return;
    }

    // Add the card to the player's hand
    hands[player].push(discard);
    lastDiscardedCard = null; // Clear the discard pile

    // Clear selection state
   // localStorage.removeItem("selectedCardId");

    // Update localStorage
    localStorage.setItem("discard", JSON.stringify(null)); // Clear discard pile
    localStorage.setItem("playerHands", JSON.stringify(hands));
    console.log(`Player ${player} drew a card from the discard pile:`, discard);
    checkMeld(player,1,0);
    // Refresh visuals and hand
    updateDiscardVisual();
    setupCardSelection(player);
    updateGameState({ drawMode: false });
}

//Hands

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
function displayPlayerHand(player) { 
    const playerHandContainer = document.getElementById('player-hand');
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};

    if (!hands[player] || hands[player].length === 0) {
        console.error(`No cards in hand for player ${player}`);
        playerHandContainer.innerHTML = '<div>No cards in hand</div>';
        return;
    }

    playerHandContainer.innerHTML = ''; // Clear existing cards

    hands[player].forEach(card => {
        if (!card || !card.value || !card.id) {
            console.error("Invalid card data:", card);
            return;
        }

        const [suit, rank] = [card.value[0], card.value.slice(1)];
        const cardElement = createCard(suit, rank, card.id);

        // Add click listeners for selection
        cardElement.addEventListener('click', () => {
            setupCardSelection(player); // Handle card selection
        });

        playerHandContainer.appendChild(cardElement);
    });
    console.log(`Displayed hand for player ${player}:`, hands[player]);
}

//Melds
const rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
function initializeMelds(player) {
    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};

   
    allMelds[player] = {
        meldGroup1: {cards: [] },
        meldGroup2: {cards: [] },
        meldGroup3: {cards: [] },
        meldGroup4: {cards: [] }
    };
        localStorage.setItem("playerMelds", JSON.stringify(allMelds));
        console.log(`Initialized melds for player: ${player}`);
    
}
function getRandomPrimaryColor() {
    const colors = ['red', 'blue', 'green', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(`Assigned random color: ${randomColor}`);
    return randomColor;
}
function addToMeld(player, groupIndex, card) {
    // Retrieve player melds from localStorage

    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};

    if (!allMelds[player]) {
        console.error(`Melds for player ${player} not found. Initialize the player first.`);
        return;
    }

    const groupKey = `meldGroup${groupIndex}`;
    if (!allMelds[player][groupKey]) {
        console.error(`Invalid meld group: ${groupKey}`);
        return;
    }

    // Add the card to the specified meld group
    allMelds[player][groupKey].cards.push(card);

    // Save back to localStorage
    localStorage.setItem("playerMelds", JSON.stringify(allMelds));

    console.log(`Added card to ${groupKey} for player ${player}:`, card);
}
function checkMeld(player, groupIndex, snn) {
    initializeMelds(player);
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};

    if (snn >= hands[player].length - 1) {
        console.log("No more cards to check.");
        return;
    }

    const [s1, r1] = [hands[player][snn].value[0], hands[player][snn].value.slice(1)];
    const [s2, r2] = [hands[player][snn+1].value[0], hands[player][snn+1].value.slice(1)];
    const rankI1 = rankOrder.indexOf(r1);
    const rankI2 = rankOrder.indexOf(r2);

    if (s1 === s2 && rankI2 - rankI1 === 1) {
        const lastIndex = meldStraight(player, snn, groupIndex);
        if (lastIndex !== 0) {
            checkMeld(player, groupIndex + 1, lastIndex + 1);
            console.log("this is a straight");
        }
        console.log('Found a straight.');
    } else if (r1 === r2) {
        const lastIndex = meldFlush(player, snn, groupIndex);
        if (lastIndex !== 0) {
            checkMeld(player, groupIndex + 1, lastIndex + 1);
            console.log("Now this this a flush");
        }
        console.log('Found a flush.');
    }

    // Highlight meld groups after checking melds
    highlightMeldCards(player);

    pMelds();
}
function meldStraight(player, indexCard, groupIndex) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    let i = indexCard;

    while (
        hands[player][i].value[0] === hands[player][i+1].value[0] && // Compare suits
        rankOrder.indexOf(hands[player][i+1].value.slice(1)) - rankOrder.indexOf(hands[player][i].value.slice(1)) === 1 // Check consecutive ranks
    ) {
        i++;
    }

    if (i >= indexCard + 2) {
        for (let j = indexCard; j <= i; j++) {
            addToMeld(player, groupIndex, hands[player][j]);
        }
        return i;
    } else {
        return 0;
    }
}


function meldFlush(player, indexCard, groupIndex) {
    const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
    let i = indexCard;

    while (
        hands[player][i].value.slice(1) === hands[player][i+1].value.slice(1) // Compare ranks
    ) {
        i++;
    }

    if (i >= indexCard + 2) {
        for (let j = indexCard; j <= i; j++) {
            addToMeld(player, groupIndex, hands[player][j]);
        }
        return i;
    } else {
        return 0;
    }
}

function highlightMeldCards(player) {
    // Retrieve player melds from localStorage
    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};

    if (!allMelds[player]) {
      //  console.error(`Melds for player ${player} not found.`);
        return;
    }

    // Assign a random color to each meld group
    Object.keys(allMelds[player]).forEach((groupKey, index) => {
        const group = allMelds[player][groupKey];
        const color = getRandomPrimaryColor();

        group.cards.forEach(card => {
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
                cardElement.style.border = `3px solid ${color}`;
                cardElement.style.boxShadow = `0 0 10px ${color}`;
            } else {
                console.warn(`Card with ID ${card.id} not found in the DOM.`);
            }
        });
    });
}

function pMelds() {
    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};

    if (Object.keys(allMelds).length === 0) {
        console.log("No meld groups found in local storage.");
        return;
    }

    Object.keys(allMelds).forEach(player => {
        console.log(`Player: ${player}`);
        Object.keys(allMelds[player]).forEach(groupKey => {
            const cards = allMelds[player][groupKey].cards;
            console.log(`  ${groupKey}:`);
            if (cards.length === 0) {
                console.log(`    (No cards)`);
            } else {
                cards.forEach(card => {
                    console.log(`    ${card.value} (ID: ${card.id})`);
                });
            }
        });
    });
}



//On Load
document.addEventListener("DOMContentLoaded", () => {
    const gameState = initializeGameState();
    initializeDeck();
    initializeDiscard();
    initializePlayerHands(plAr);
    updateTurnIndicator(plAr);
    plAr.forEach(player => dealCardsToPlayer(player, 15));
    displayPlayerHand(plAr[gameState.currentPlayerIndex]);
});
document.getElementById('new-card').addEventListener('click', () => {
    const gameState = getGameState();
    const currentPlayer = plAr[gameState.currentPlayerIndex];

    if (gameState.drawMode) {
        drawCard(currentPlayer);
        updateGameState({ drawMode: false });
        displayPlayerHand(currentPlayer);
    }else {
        console.error("You have already drawn this turn! Please discard a card.");
    }
});
document.getElementById('discard').addEventListener('click', () => {
    const gameState = getGameState();
    const currentPlayer = plAr[gameState.currentPlayerIndex];

    if (gameState.drawMode) {
        // Handle drawing from discard pile
        drawFromDiscard(currentPlayer);
    } else if(localStorage.getItem("selectedCardId")){
        // Handle discarding a card
        discardCard(currentPlayer);
        // Switch to the next player after discarding
        const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % plAr.length;
        updateGameState({ currentPlayerIndex: nextPlayerIndex, drawMode: true });
        updateTurnIndicator(plAr);
        displayPlayerHand(plAr[nextPlayerIndex]);
    }
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