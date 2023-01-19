const cardArray = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const cardValue = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
  A: [1, 11],
};

let blackjackgame = {
  Player: {
    scoreSpan: 0,
    "ID-Span-Score": "#Player-Span-Score",
    "ID-Wins-Table": "#Wins-Table",
    "ID-Draws-Table": "#Draws-Table",
    "ID-Loses-Table": "#Loses-Table",
  },
  Dealer: { scoreSpan: 0, "ID-Span-Score": "#Dealer-Span-Score" },
};
const YOU = blackjackgame.Player;
const DEALER = blackjackgame.Dealer;

let winTable = 0;
let drawTable = 0;
let losesTable = 0;

let resultMessage = document.querySelector("#ResultMessage");

document.querySelector("#hit-button").addEventListener("click", hitButton);
document.querySelector("#stand-button").addEventListener("click", standButton);
document.querySelector("#deal-button").addEventListener("click", dealButton);

let hitAudio = new Audio("./sounds/swish.m4a");
let winAudio = new Audio("./sounds/cash.mp3");
let drawAudio = new Audio("./sounds/aww.mp3");

let startGame = true;
let stand = false;
let turnOver = false;

function hitButton() {
  if (startGame === true || (stand === false && turnOver === false)) {
    let randomNumber = Math.floor(Math.random() * 13);
    let card = document.createElement("img");
    card.src = `./images/${cardArray[randomNumber]}.png`;
    card.width = 80;
    card.style.border = "1px solid black";
    card.style.borderRadius = "6px";
    card.style.marginRight = "1rem";
    document.querySelector("#Player-Box").appendChild(card);
    hitAudio.play();

    updateScore(randomNumber, YOU);

    if (YOU.scoreSpan > 21) {
      updateResultAndTable();
    }
    startGame = false;
  }
}

function sleep(waitTime) {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}

function dealButton() {
  if (turnOver === true) {
    resultMessage.innerHTML = "Lets Play";
    resultMessage.style.color = "black";

    YOU.scoreSpan = 0;
    document.querySelector(YOU["ID-Span-Score"]).innerHTML = YOU.scoreSpan;
    document.querySelector(YOU["ID-Span-Score"]).style.color = "black";
    DEALER.scoreSpan = 0;
    document.querySelector(DEALER["ID-Span-Score"]).innerHTML = YOU.scoreSpan;
    document.querySelector(DEALER["ID-Span-Score"]).style.color = "black";

    let allCards = document
      .getElementById("flexboxRow1")
      .querySelectorAll("img");
    for (i = 0; i < allCards.length; i++) {
      allCards[i].remove();
    }
    startGame = true;
    stand = false;
    turnOver = false;
  }
}

async function standButton() {
  if (startGame === false && turnOver === false) {
    while (
      DEALER.scoreSpan < 17 ||
      (YOU.scoreSpan >= 17 && DEALER.scoreSpan >= 17)
    ) {
      let randomNumber = Math.floor(Math.random() * 13);
      let card = document.createElement("img");
      card.src = `./images/${cardArray[randomNumber]}.png`;
      card.width = 80;
      card.style.border = "1px solid black";
      card.style.borderRadius = "6px";
      card.style.marginRight = "1rem";
      document.querySelector("#Dealer-Box").appendChild(card);
      hitAudio.play();

      updateScore(randomNumber, DEALER);

      if (YOU.scoreSpan < DEALER.scoreSpan) {
        updateResultAndTable();
        return;
      }
      if (DEALER.scoreSpan > 21) {
        updateResultAndTable();
        return;
      }
      await sleep(1000);
    }
    stand = true;
  }
}

function updateScore(cardNumber, activePlayer) {
  if (cardNumber !== 12) {
    activePlayer.scoreSpan += cardValue[cardArray[cardNumber]];

    if (activePlayer.scoreSpan <= 21) {
      document.querySelector(activePlayer["ID-Span-Score"]).innerHTML =
        activePlayer.scoreSpan;
    } else {
      document.querySelector(activePlayer["ID-Span-Score"]).innerHTML = "Bust";
      document.querySelector(activePlayer["ID-Span-Score"]).style.color = "red";
    }
  } else {
    if (activePlayer.scoreSpan + 11 <= 21) {
      activePlayer.scoreSpan += cardValue[cardArray[cardNumber]][1];

      document.querySelector(activePlayer["ID-Span-Score"]).innerHTML =
        activePlayer.scoreSpan;
    } else {
      activePlayer.scoreSpan += cardValue[cardArray[cardNumber]][0];
      document.querySelector(activePlayer["ID-Span-Score"]).innerHTML =
        activePlayer.scoreSpan;
    }
  }
}

function updateResultAndTable() {
  if (YOU.scoreSpan <= 21) {
    if (YOU.scoreSpan > DEALER.scoreSpan) {
      resultMessage.innerHTML = "You Won";
      resultMessage.style.color = "green";
      winAudio.play();
      winTable += 1;
      document.querySelector("#Wins-Table").innerHTML = winTable;
      return;
    } else if (YOU.scoreSpan < DEALER.scoreSpan) {
      if (DEALER.scoreSpan <= 21) {
        resultMessage.innerHTML = "You Lost";
        drawAudio.play();
        resultMessage.style.color = "red";
        losesTable += 1;
        document.querySelector("#Loses-Table").innerHTML = losesTable;
      } else {
        resultMessage.innerHTML = "You Won";
        winAudio.play();
        resultMessage.style.color = "green";
        winTable += 1;
        document.querySelector("#Wins-Table").innerHTML = winTable;
      }
    } else {
      resultMessage.innerHTML = "You Draw";
      resultMessage.style.color = "Yellow";
      drawTable += 1;
      document.querySelector("#Draws-Table").innerHTML = drawTable;
    }
  } else {
    resultMessage.innerHTML = "You Lost";
    drawAudio.play();
    resultMessage.style.color = "red";
    losesTable += 1;
    document.querySelector("#Loses-Table").innerHTML = losesTable;
  }
  turnOver = true;
}
