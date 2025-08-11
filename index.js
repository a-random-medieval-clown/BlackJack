// ========= Deck Setup =========
const cards = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];

const hearts = cards.map(card => card + "_of_hearts");
const clubs = cards.map(card => card + "_of_clubs");
const spades = cards.map(card => card + "_of_spades");
const diamonds = cards.map(card => card + "_of_diamonds");

const playerWin = document.getElementById(`playerWin`);
const playerValue = document.getElementById(`playerValue`);
const playerTextBox = document.getElementById(`playerBoxText`);
const dealerWin = document.getElementById(`dealerWin`);
const dealerValue = document.getElementById(`dealerValue`);
const dealerTextBox = document.getElementById(`dealerBoxText`);
const playerInstruction = document.getElementById(`instruction1`);
const dealerInstruction = document.getElementById(`instruction2`);

let deck = [...hearts, ...clubs, ...spades, ...diamonds];
let drewCard = "";
let drewCard1 = "";
let drewCard2 = "";
let playerHand = [];
let playerHandValue = [];
let dealerHand = [];
let dealerHandValue = [];
let totalPlayerValue;
let totalDealerValue;

// Track wins and losses
let playerWins = 0;
let dealerWins = 0;

// ========= Shuffle Function =========
function shuffle(array) { // shuffles the deck
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];  // swap
  }
  return array;
}

deck = shuffle(deck);

// ========= Game State =========
let playerDeal = false;
let dealerDeal = false;

//========= Swtich Card Values of Aces and Face Cards =========
function switchValue(element) {
  switch (element) {
    case "ace": return 11;
    case "king":
    case "queen":
    case "jack": return 10;
    default: return Number(element);
  }
}

//========= Ace Value =========
function calculateHandValue(values) {
  let sum = values.reduce((a, b) => a + b, 0);
  let aceCount = values.filter(v => v === 11).length;

  while (sum > 21 && aceCount > 0) {
    sum -= 10; // count one ace as 1 instead of 11
    aceCount--;
  }
  return sum;
}

//========= Disable Player Actions =========
function disablePlayerActions() {
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("start").disabled = true;
}

//========= Enable Player Actions =========
function enablePlayerActions() {
  document.getElementById("hit").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("start").disabled = false;
}

//========= Reset game for new round (no reload) =========
function resetGameForNewRound() {
  // Clear hands and values
  playerHand = [];
  playerHandValue = [];
  dealerHand = [];
  dealerHandValue = [];
  totalPlayerValue = 0;
  totalDealerValue = 0;

  playerDeal = false;
  dealerDeal = false;

  document.querySelector(".playerBox").innerHTML = "";
  document.querySelector(".dealerBox").innerHTML = "";

  deck = shuffle([...hearts, ...clubs, ...spades, ...diamonds]);

  enablePlayerActions();

  playerTextBox.textContent = `Click Deal / Start to Play!`
  dealerTextBox.textContent = `Click Deal / Start to Play!`

  playerInstruction.textContent = ``
  dealerInstruction.textContent = ``

  playerValue.textContent = `Value: 0`
  dealerValue.textContent = `Value: 0`

  console.log(`Player Wins: ${playerWins} | Dealer Wins: ${dealerWins}`);
}

//========= Draw Cards =========
function draw() { //Hit 
  if (deck.length === 0) {
    alert("Deck is empty! Reloading...");
    resetGameForNewRound();
    return;
  }

  if (!playerDeal && !dealerDeal) {
    alert("Cannot Hit Cards! Start the game first by clicking the Deal/Start Button!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(randomIndex, 1)[0];
  drewCard = card;

  const [value] = drewCard.split("_");
  const cardValue = switchValue(value);

  if (!drewCard) return; // no card drawn yet

  const img = document.createElement("img");
  img.src = `cards/images/${drewCard}.png`;
  img.alt = drewCard;
  img.id = "cardImage";
  img.classList.add("card");

  document.querySelector(".playerBox").appendChild(img);

  playerHand.push(drewCard);
  playerHandValue.push(cardValue);
  totalPlayerValue = calculateHandValue(playerHandValue);
  playerValue.textContent = `Value: ${totalPlayerValue}`;

  if (totalPlayerValue === 21) {
    setTimeout(() => {
      alert(`You Win! You hit 21!`);
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
    }, 200);
    disablePlayerActions();
    playerWins++;
    playerWin.textContent = `Wins: ${playerWins}`;
    return;
  }
  else if (totalPlayerValue > 21) {
    setTimeout(() => {
      alert(`Bust! You Lose!`);
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
    }, 200);
    disablePlayerActions();
    dealerWins++;
    dealerWin.textContent = `Wins: ${dealerWins}`;
    return;
  }

  console.log("Drawn card:", drewCard);
  console.log("Value of drawn card:", cardValue);
  console.log("Player's hand cards:", playerHand);
  console.log("Remaining cards in deck:", deck.length);
  console.log("Total Player Hand Value:", totalPlayerValue);
}

// ========= Start Game =========
function start() {

  if (playerDeal === true && dealerDeal === true) {
    alert(`Can't start game! You are already in game!`);
    return;
  }

  let playerCardValue1;
  let playerCardValue2;

  // Player draw
  if (!playerDeal) {
    playerTextBox.textContent = ``

    const randomIndex1 = Math.floor(Math.random() * deck.length);
    const card1 = deck.splice(randomIndex1, 1)[0];
    drewCard1 = card1;

    const randomIndex2 = Math.floor(Math.random() * deck.length);
    const card2 = deck.splice(randomIndex2, 1)[0];
    drewCard2 = card2;

    const [value1] = drewCard1.split("_");
    playerCardValue1 = switchValue(value1);

    const [value2] = drewCard2.split("_");
    playerCardValue2 = switchValue(value2);

    playerHand.push(drewCard1, drewCard2);

    console.log("Player's first drawn card:", drewCard1);
    console.log("Value of player's first card:", playerCardValue1);
    console.log("Player's second drawn card:", drewCard2);
    console.log("Value of player's second card:", playerCardValue2);
    console.log("Remaining cards in deck after player draw:", deck.length);
    console.log("Player's hand cards after deal:", playerHand);

    const img1 = document.createElement("img");
    img1.src = `cards/images/${drewCard1}.png`;
    img1.alt = drewCard1;
    img1.classList.add("card");

    document.querySelector(".playerBox").appendChild(img1);

    const img2 = document.createElement("img");
    img2.src = `cards/images/${drewCard2}.png`;
    img2.alt = drewCard2;
    img2.classList.add("card");

    document.querySelector(".playerBox").appendChild(img2);

    playerDeal = true;
  }

  let dealerCardValue1;
  let dealerCardValue2;

  // Dealer draw
  if (!dealerDeal) {
    dealerTextBox.textContent = ``
    const randomIndex1 = Math.floor(Math.random() * deck.length);
    const card1 = deck.splice(randomIndex1, 1)[0];
    drewCard1 = card1;

    const randomIndex2 = Math.floor(Math.random() * deck.length);
    const card2 = deck.splice(randomIndex2, 1)[0];
    drewCard2 = card2;

    const [value1] = drewCard1.split("_");
    dealerCardValue1 = switchValue(value1);

    const [value2] = drewCard2.split("_");
    dealerCardValue2 = switchValue(value2);

    dealerHand.push(drewCard1, drewCard2);

    console.log("Dealer's first drawn card:", drewCard1);
    console.log("Value of dealer's first card:", dealerCardValue1);
    console.log("Dealer's second drawn card:", drewCard2);
    console.log("Value of dealer's second card:", dealerCardValue2);
    console.log("Remaining cards in deck after dealer draw:", deck.length);
    console.log("Dealer's hand cards after deal:", dealerHand);

    const img1 = document.createElement("img");
    img1.src = `cards/images/${drewCard1}.png`;
    img1.alt = drewCard1;
    img1.classList.add("card");

    document.querySelector(".dealerBox").appendChild(img1);

    const img2 = document.createElement("img");
    img2.src = `cards/images/back.png`;
    img2.alt = drewCard2;
    img2.classList.add("card");

    document.querySelector(".dealerBox").appendChild(img2);

    dealerDeal = true;
  }

  playerHandValue.push(playerCardValue1, playerCardValue2);
  totalPlayerValue = calculateHandValue(playerHandValue);
  playerValue.textContent = `Value: ${totalPlayerValue}`;

  dealerHandValue.push(dealerCardValue1, dealerCardValue2);
  dealerValue.textContent = `Value: ${dealerCardValue1}`;

  console.log("Player Hand Value array:", playerHandValue);
  console.log("Dealer Hand Value array:", dealerHandValue);

  if (totalPlayerValue === 21) {
    setTimeout(() => {
      alert(`You Win! Instant BlackJack!`);
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      disablePlayerActions();
    }, 200);
    playerWins++;
    playerWin.textContent = `Wins: ${playerWins}`;
    disablePlayerActions();
    return;
  } else if (totalPlayerValue > 21) {
    setTimeout(() => {
      alert(`You Lose! Better Luck Next Time`);
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      disablePlayerActions();
    }, 200);
    dealerWins++;
    dealerWin.textContent = `Wins: ${dealerWins}`;
    disablePlayerActions();
    return;
  }
}

function stand() {
  disablePlayerActions();

  if (!playerDeal && !dealerDeal) {
    alert("Cannot Stand! Start the game first by clicking the Deal/Start Button!");
    return;
  }

  const dealerCards = document.querySelectorAll(".dealerBox img"); // image replacer
  const faceDownCard = Array.from(dealerCards).find(img => img.src.includes("back.png"));

  if (faceDownCard) {
    faceDownCard.src = `cards/images/${drewCard2}.png`;
    faceDownCard.alt = drewCard2;

    totalDealerValue = calculateHandValue(dealerHandValue);
    dealerValue.textContent = `Value: ${totalDealerValue}`;
  }

  while (totalDealerValue < 17) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];
    drewCard = card;

    const [value] = drewCard.split("_");
    const cardValue = switchValue(value);

    if (!drewCard) return; // no card drawn yet

    const img = document.createElement("img");
    img.src = `cards/images/${drewCard}.png`;
    img.alt = drewCard;
    img.id = "cardImage";
    img.classList.add("card");

    document.querySelector(".dealerBox").appendChild(img);

    dealerHand.push(drewCard);
    dealerHandValue.push(cardValue);
    totalDealerValue = calculateHandValue(dealerHandValue);
    dealerValue.textContent = `Value: ${totalDealerValue}`;

  }

  if (totalDealerValue > 21) {
    setTimeout(() => {
      alert("Dealer Busts! You Win!");
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      playerWins++;
      playerWin.textContent = `Wins: ${playerWins}`;
      disablePlayerActions()
    }, 200);
    return;
  }
  else if (totalDealerValue === totalPlayerValue) {
    setTimeout(() => {
      alert("Push! It's a tie.");
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      disablePlayerActions()
    }, 200);
    return;
  }
  else if (totalDealerValue > totalPlayerValue) {
    setTimeout(() => {
      alert("You Lose! Better Luck Next Time");
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      dealerWins++;
      dealerWin.textContent = `Wins: ${dealerWins}`;
      disablePlayerActions()
    }, 200);
    return;
  }
  else {
    setTimeout(() => {
      alert("You Win! Congratulations!");
      playerInstruction.textContent = `Click New Game for another round!`
      dealerInstruction.textContent = `Click New Game for another round!`
      playerWins++;
      playerWin.textContent = `Wins: ${playerWins}`;
      disablePlayerActions()
    }, 200);
    return;
  }
}
