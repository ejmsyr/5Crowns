function initializeMelds(player) {
    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};
    if (!allMelds[player]) {
        allMelds[player] = {
            1: [],
            2: [],
            3: [],
            4: []
        };
    }
    localStorage.setItem("playerMelds", JSON.stringify(allMelds));
}
let rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
function checkMeld(player, hand, index, gi) {
    let melds = JSON.parse(localStorage.getItem("playerMelds"));
    let plMelds = melds[player];

    // Reset melds for the first go-around
    if (gi === 1) {
        for (let i = 1; i <= 4; i++) {
            plMelds[i] = []; // Clear each meld group
        }
        melds[player] = plMelds;
        localStorage.setItem("playerMelds", JSON.stringify(melds));
        console.log("Reset melds for", player, plMelds);
    }

 //   console.log(melds, "Current Melds");

    // Check for a straight starting at the given index
    if (Strt(hand, index) && Strt(hand, index + 1)) {
        let cc = 2; // Counter for straight length
        while (Strt(hand, index + cc)) {
            cc += 1;
            console.log("foursome");
        }

        console.log("Valid Straight: ");
        for (let i = index; i < index + cc + 1; i++) {
            if (!plMelds[gi]) plMelds[gi] = []; // Ensure the group exists
            plMelds[gi].push(hand[i]); // Push card to the group
        }

        console.log("Displaying melds for", player, ": ", plMelds);

        melds[player] = plMelds;
        localStorage.setItem("playerMelds", JSON.stringify(melds));

        checkMeld(player, hand, index + cc+1,gi+1); // Continue checking for additional melds
    }

    if (mlti(hand, index) && mlti(hand, index + 1)) {
        let cc = 2; // Counter for flush length
        while (mlti(hand, index + cc)) {
            cc += 1;
            console.log("foursome");
        }

        console.log("Valid Flush: ");
        for (let i = index; i < index + cc + 1; i++) {
            if (!plMelds[gi]) plMelds[gi] = []; // Ensure the group exists
            plMelds[gi].push(hand[i]); // Push card to the group
        }

        console.log("Displaying melds for", player, ": ", plMelds);

        melds[player] = plMelds;
        localStorage.setItem("playerMelds", JSON.stringify(melds));

        checkMeld(player, hand, index + cc+1, gi + 1); // Continue checking for additional melds
        console.log(index,cc,gi)
    }
}


function Strt(h,c){
    if(h[c+1]){
        if(rankOrder.indexOf(h[c+1].value.slice(1))-rankOrder.indexOf(h[c].value.slice(1))===1&&h[c+1].value[0]===h[c].value[0]){
        return true;
        } else{
            return false;
        }
    };
    
}
function mlti(h,c){
    if(h[c+1]){
if(h[c].value.slice(1)===h[c+1].value.slice(1))
        return true;
    } else {
        return false;
    }
}

// function makeItKnown(player) {
//     let melds = JSON.parse(localStorage.getItem("playerMelds"));
//     let plMelds = melds[player];

//     function applyBorder(cards, color) {
//         cards.forEach(card => {
//             let cardElement = card.id;  
//             console.log(cardElement);
//             if (cardElement) {
//                 cardElement.classList.add(color);
//             }
//         });
//     }

//     if (plMelds[1].length > 0) applyBorder(plMelds[1], "red-border");
//     if (plMelds[2].length > 0) applyBorder(plMelds[2], "green-border");
//     if (plMelds[3].length > 0) applyBorder(plMelds[3], "lightblue-border");
//     if (plMelds[4].length > 0) applyBorder(plMelds[4], "purple-border");
// }

