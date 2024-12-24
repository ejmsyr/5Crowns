function setUpRound(round) {
  // Get player names and scores from local storage
  const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
  const playerScores = JSON.parse(localStorage.getItem("playerScores")) || {};

  // Clear all local storage except player names and scores
  localStorage.clear();
  localStorage.setItem("playerNames", JSON.stringify(playerNames));
  localStorage.setItem("playerScores", JSON.stringify(playerScores));

  // Reinitialize the deck
  const deck = generateDeck();
  localStorage.setItem("deck", JSON.stringify(deck));

  // Initialize the discard pile
  const discardPile = [];
  localStorage.setItem("discard", JSON.stringify(discardPile));

  // Initialize hands and deal cards
  const playerHands = {};
  const cardsToDeal = round + 2; // Round 1 = 3 cards, Round 2 = 4 cards, etc.

  playerNames.forEach(player => {
      playerHands[player] = [];
      for (let i = 0; i < cardsToDeal; i++) {
          if (deck.length === 0) {
              console.error("Deck is empty while dealing cards!");
              break;
          }
          const card = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
          playerHands[player].push(card);
      }
  });

  // Save updated hands and deck
  localStorage.setItem("playerHands", JSON.stringify(playerHands));
  localStorage.setItem("deck", JSON.stringify(deck));

  // Log for debugging
  console.log(`Round ${round} setup complete.`);
  console.log("Player hands:", playerHands);
  console.log("Remaining deck:", deck);
}

function checkRound() {
  const gameState = JSON.parse(localStorage.getItem("gameState")) || {};
  const currentPlayerIndex = gameState.currentPlayerIndex;
  const playerNames = JSON.parse(localStorage.getItem("playerArray")) || [];
  const currentPlayer = playerNames[currentPlayerIndex];
  const playerHands = JSON.parse(localStorage.getItem("playerHands")) || {};
  const currentHand = playerHands[currentPlayer] || [];

  // Check if all cards except the last are part of a meld
  let melds = JSON.parse(localStorage.getItem("playerMelds"));
  const playerMelds = melds[currentPlayer];

  if(playerMelds[1].length+playerMelds[2].length+playerMelds[3].length+playerMelds[4].length===gameState.Round+2){
    console.log("Running");
    localStorage.setItem("endMode", JSON.stringify(true)); // Save the game state

      const endGameButton = document.createElement("button");
      endGameButton.textContent = "End Game";
      endGameButton.onclick = () => {
          switchToNextPlayer();
      };
      document.body.appendChild(endGameButton);
  }
  
}

function switchToNextPlayer() {
  const gameState = JSON.parse(localStorage.getItem("gameState")) || {};
  const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
  const currentPlayerIndex = gameState.currentPlayerIndex;
  const nextPlayerIndex = (currentPlayerIndex + 1) % playerNames.length;

  // Update game state to switch to the next player
  gameState.currentPlayerIndex = nextPlayerIndex;
  localStorage.setItem("gameState", JSON.stringify(gameState));

  // At the end of the next player's turn, score non-melded cards
  const playerHands = JSON.parse(localStorage.getItem("playerHands")) || {};
  const nextPlayer = playerNames[nextPlayerIndex];
  const nextHand = playerHands[nextPlayer] || [];

  const melds = JSON.parse(localStorage.getItem("playerMelds")) || {};
  const playerMelds = melds[nextPlayer] || [];

  const nonMeldedCards = nextHand.filter(card => {
      return !playerMelds.some(group => group.some(meldedCard => meldedCard.id === card.id));
  });

  const playerScores = JSON.parse(localStorage.getItem("playerScores")) || {};
  playerScores[nextPlayer] = (playerScores[nextPlayer] || 0) + nonMeldedCards.reduce((sum, card) => {
      return sum + getCardValue(card);
  }, 0);

  localStorage.setItem("playerScores", JSON.stringify(playerScores));
  console.log(playerScores);
  console.log(`Switching to player ${nextPlayer}.`);
  console.log(`Non-melded cards added to score:`, nonMeldedCards);
  gameState.Round+=1;
  setUpRound(gameState.Round);
}

function getCardValue(card) {
  const rank = card.value.slice(1);
  const rankValues = {
      '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'j': 11, 'q': 12, 'k': 13, 'J': 50
  };
  return rankValues[rank] || 0;
}
