(() => {
  let cardDeck = [];
  let userPickedCards = []; //A list with all cards a user picked.
  let computerPickedCards = [];
  let cardsPool = []; //Our pool with all the cards
  let playerScore = 0;
  let computerScore = 0;
  let isGameOver = false;

  const buildCardDeck = () => {
    let suits = ['Clubs', 'Spades', 'Diamonds', 'Hearts'];

    //Generates an array with elements from 2-10 and then adds Jack,Queen and King
    let names = [
      'Ace',
      ...Array.from({ length: 9 }, (_, i) => (i + 2).toString()),
      'Jack',
      'Queen',
      'King',
    ];

    //Create 13 objects per suit
    for (let suit of suits) {
      for (let i = 0; i < names.length; i++) {
        let card = {
          suit: suit,
          name: names[i],
          score: Math.min(i + 1, 10), //Caps i to 10 as that is the maximum score.
          url: `./Assets/Cards/card${suit}${names[i]}.png`,
        };
        cardDeck.push(card);
      }
    }
  };

  const startNewGame = () => {
    cardsPool = [...cardDeck];
    computerScore = 0;
    playerScore = 0;
    isGameOver = false;
    computerPickedCards = [];
    userPickedCards = [];
    redrawGame();
  };

  const redrawGame = () => {
    let playerCardImg = document.getElementById('player-drawn-card-image');
    let computerCardImg = document.getElementById('computer-drawn-card-image');
    let titleElement = document.getElementById('game-title');
    let computerScoreElement = document.getElementById('computer-score');
    let playerScoreElement = document.getElementById('player-score');

    if (playerCardImg) {
      playerCardImg.src = './Assets/Cards/cardBack_red4.png';

      //Make it accessible always update the alt tag
      playerCardImg.alt = 'card back';
      playerCardImg.style.visibility = 'hidden';
    }

    if (computerCardImg) {
      playerCardImg.src = './Assets/Cards/cardBack_red4.png';

      //Make it accessible always update the alt tag
      computerCardImg.alt = 'card back';
      computerCardImg.style.visibility = 'hidden';
    }

    titleElement.innerHTML = 'Draw a card.';
    computerScoreElement.innerHTML = computerScore;
    playerScoreElement.innerHTML = playerScore;
  };

  const getRandomNr = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  buildCardDeck();
  startNewGame();

  const drawACard = () => {
    let randIndex = getRandomNr(0, cardsPool.length);
    let randomCard = cardsPool[randIndex];
    console.log(`${randomCard.name} of ${randomCard.suit}`);

    //removes elements from startindex, nr of elements to remove.
    cardsPool.splice(randIndex, 1);

    return randomCard;
  };

  const AddPlayerCard = (card) => {
    userPickedCards.push(card);

    let lastDrawnCardImg = document.getElementById('player-drawn-card-image');

    if (lastDrawnCardImg) {
      lastDrawnCardImg.src = card.url;

      //Make it accessible always update the alt tag
      lastDrawnCardImg.alt = `${card.name} of ${card.suit}`;
      lastDrawnCardImg.style.visibility = 'visible';
    }

    playerScore += card.score;

    let playerScoreElement = document.getElementById('player-score');
    playerScoreElement.innerHTML = playerScore;
  };

  const AddComputerCard = (card) => {
    computerPickedCards.push(card);
    let lastDrawnCardImg = document.getElementById('computer-drawn-card-image');

    if (lastDrawnCardImg) {
      lastDrawnCardImg.src = card.url;

      //Make it accessible always update the alt tag
      lastDrawnCardImg.alt = `${card.name} of ${card.suit}`;
      lastDrawnCardImg.style.visibility = 'visible';
    }

    computerScore += card.score;

    let computerScoreElement = document.getElementById('computer-score');
    computerScoreElement.innerHTML = computerScore;
  };

  const checkScores = (checkComputer) => {
    if ((playerScore === 21 && computerScore !== 21) || computerScore > 21) {
      var titleElement = document.getElementById('game-title');
      titleElement.innerHTML = 'The player has won!';
      isGameOver = true;
    } else if (
      playerScore > 21 ||
      (checkComputer && computerScore >= playerScore && computerScore <= 21)
    ) {
      var titleElement = document.getElementById('game-title');
      titleElement.innerHTML = 'The dealer has won.';
      isGameOver = true;
    }
    /*else i*/
  };

  document.getElementById('stop-button').addEventListener('click', () => {
    if (!isGameOver) {
      var drawCardInterval = null;
      drawCardInterval = setInterval(() => {
        let computerCard = drawACard();
        AddComputerCard(computerCard);
        checkScores(true);
        if (isGameOver) {
          clearInterval(drawCardInterval);
        }
      }, 500);
    }
  });

  document.getElementById('deck-cards').addEventListener('click', () => {
    if (!isGameOver) {
      //draw a card
      if (cardsPool.length >= 2) {
        let playerCard = drawACard();
        AddPlayerCard(playerCard);
        checkScores(false);
      }
    }
  });

  document.getElementById('restart-button').addEventListener('click', () => {
    startNewGame();
  });
})();
