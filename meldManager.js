class MeldManager {
    constructor() {
        this.rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
    }

    initializeMelds(player) {
        const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};
        if (!allMelds[player]) {
            allMelds[player] = {
                groups: []
            };
        }
        localStorage.setItem("playerMelds", JSON.stringify(allMelds));
        console.log(`Initialized melds for player: ${player}`);
    }

    addToMeld(player, groupIndex, card) {
        const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};
        if (!allMelds[player] || !allMelds[player].groups[groupIndex]) {
            console.error(`Invalid meld group or player: ${player}, groupIndex: ${groupIndex}`);
            return;
        }
        allMelds[player].groups[groupIndex].push(card);
        localStorage.setItem("playerMelds", JSON.stringify(allMelds));
        console.log(`Added card to meld for player ${player}:`, card);
    }

    checkMelds(player) {
        const hands = JSON.parse(localStorage.getItem("playerHands")) || {};
        const playerHand = hands[player] || [];
        this.initializeMelds(player);
    
        const allMelds = JSON.parse(localStorage.getItem("playerMelds"));
        allMelds[player].groups = []; // Reset melds before checking
    
        // Sort the hand by suit and rank
        playerHand.sort((a, b) => {
            const suitComparison = a.value[0].localeCompare(b.value[0]);
            if (suitComparison !== 0) return suitComparison;
            return this.rankOrder.indexOf(a.value.slice(1)) - this.rankOrder.indexOf(b.value.slice(1));
        });
    
        console.log(`Sorted hand for player ${player}:`, playerHand);
    
        let currentGroup = [];
        for (let i = 0; i < playerHand.length; i++) {
            const currentCard = playerHand[i];
            if (!currentGroup.length || this.isCardInSequence(currentGroup[currentGroup.length - 1], currentCard)) {
                currentGroup.push(currentCard);
            } else {
                if (currentGroup.length >= 3) allMelds[player].groups.push(currentGroup);
                currentGroup = [currentCard];
            }
        }
    
        // Add the last group if valid
        if (currentGroup.length >= 3) {
            allMelds[player].groups.push(currentGroup);
        }
    
        localStorage.setItem("playerMelds", JSON.stringify(allMelds));
        console.log(`Checked melds for player ${player}:`, allMelds[player].groups);
    }
    
    // Helper function
    isCardInSequence(card1, card2) {
        const sameSuit = card1.value[0] === card2.value[0];
        const consecutiveRank = this.rankOrder.indexOf(card2.value.slice(1)) - this.rankOrder.indexOf(card1.value.slice(1)) === 1;
        return sameSuit && consecutiveRank;
    }
    

    highlightMelds(player) {
        const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};
        if (!allMelds[player]) {
            console.error(`No melds found for player: ${player}`);
            return;
        }

        allMelds[player].groups.forEach((group, index) => {
            const color = this.getRandomPrimaryColor();
            group.forEach(card => {
                const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
                if (cardElement) {
                    cardElement.style.border = `3px solid ${color}`;
                    cardElement.style.boxShadow = `0 0 10px ${color}`;
                }
            });
        });
    }

    getRandomPrimaryColor() {
        const colors = ['red', 'blue', 'green', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
