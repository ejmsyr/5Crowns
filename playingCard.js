// playingCard.js

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
