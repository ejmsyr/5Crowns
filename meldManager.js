function initializeMelds(player) {
    const allMelds = JSON.parse(localStorage.getItem("playerMelds")) || {};
    if (!allMelds[player]) {
        allMelds[player] = {
            groups: []
        };
    }
    localStorage.setItem("playerMelds", JSON.stringify(allMelds));
    console.log(`Initialized melds for player: ${player}`);
}
let rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'J'];
function checkMeld(hand,index,gi){
    let melds=JSON.parse(localStorage.getItem("playerMelds"))
    //JSON.parse(localStorage.getItem("gameState"))
    //for(let card=index; card<hand.length-index; card++){
      //  console.log(card,hand[card].value.slice(1));
    //}
    console.log(melds,333);
//See if straight at index 0,1
    console.log(checkS(hand,index));
    if(checkS(hand,index)&&checkS(hand,index+1)){
        let cc=2;
        while(checkS(hand,index+cc)){
            cc+=1;
            console.log("foursome");
        }
        console.log("Valid Straight: ");
        for(i=index; i<index+cc+1; i++){
            melds[gi][index-i]=hand[i];
            console.log(hand[i],", ");
        }
        console.log(melds[gi]);
        checkMeld(hand,cc,gi+1);
        //push to group one
    }
//Check for full straight,  if valid, add all to meld group one and highlight one of the colours
//run checkMeld for last index of straight+1
//if not check for flush on index 0,1
//check for flush same for straight
//run checkMeld for last index of straight+1
}
function checkS(h,c){
    if(rankOrder.indexOf(h[c+1])){
        if(rankOrder.indexOf(h[c+1].value.slice(1))-rankOrder.indexOf(h[c].value.slice(1))===1&&h[c+1].value[0]===h[c].value[0]){
        return true;
        } else{
            return false;
        }
    };
    
}