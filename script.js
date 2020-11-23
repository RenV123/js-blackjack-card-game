'use strict';

(() => {
  let cardDeck = [];
  let userPickedCards = []; //A list with all cards a user picked.
  let computerPickedCards = [];
  let cardsPool = []; //Our pool with all the cards
  let playerScore = 0;
  let computerScore = 0;
  let isGameOver = false;
  const cardStackingOffset = 37; //Offset of the cards in pixels

  /**
   * Builds an array of card objects with a suit, name, url and score parameter.
   */
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

  /**
   * Starts a new Game.
   * Resets all the scoring variables.
   */
  const startNewGame = () => {
    cardsPool = [...cardDeck];
    computerScore = 0;
    playerScore = 0;
    isGameOver = false;
    computerPickedCards = [];
    userPickedCards = [];
    redrawGame();
  };

  /**
   * Redraw/reset the important HTML elements of the game.
   */
  const redrawGame = () => {
    let playerCardsContainer = document.getElementById(
      'player-cards-container'
    );
    let computerCardsContainer = document.getElementById(
      'computer-cards-container'
    );
    let titleElement = document.getElementById('game-title');
    let computerScoreElement = document.getElementById('computer-score');
    let playerScoreElement = document.getElementById('player-score');

    while (playerCardsContainer.firstChild) {
      playerCardsContainer.removeChild(playerCardsContainer.lastChild);
    }

    while (computerCardsContainer.firstChild) {
      computerCardsContainer.removeChild(computerCardsContainer.lastChild);
    }

    titleElement.innerHTML = 'Draw a card.';
    computerScoreElement.innerHTML = computerScore;
    playerScoreElement.innerHTML = playerScore;
  };

  /**
   * A function that generates a random number between a range.
   * @param {number} min The minimum range of the random nr.
   * @param {number} max The maximum range of the random nr.
   */
  const getRandomNr = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Draw a card from the cardsPool.
   * @return {object} Returns a card object from the cardPool.
   */
  const drawACard = () => {
    let randIndex = getRandomNr(0, cardsPool.length);
    let randomCard = cardsPool[randIndex];

    //removes elements from startindex, nr of elements to remove.
    cardsPool.splice(randIndex, 1);

    return randomCard;
  };

  /**
   * Calculates the position of the card on the screen.
   * @param {object} cardContainer
   * @param {number} offset
   * @return {object} A bounds object that contains an top and left object.
   */
  const calculateCardPosition = (cardContainer, offset) => {
    var bounds = {};

    if (cardContainer) {
      bounds = { ...cardContainer.getBoundingClientRect() };
      /* Calculate card position*/
      if (cardContainer.lastChild) {
        bounds.top =
          cardContainer.lastChild.getBoundingClientRect().top + offset;
      }
    }

    return bounds;
  };

  /**
   * Creates an HTML image element from a card object.
   * @param {object} card
   * @param {object} bounds
   */
  const createCardElement = (card, bounds) => {
    let cardImg = document.createElement('img');
    cardImg.src = card.url;

    //Make it accessible always update the alt tag
    cardImg.alt = `${card.name} of ${card.suit}`;
    cardImg.style.position = 'absolute';
    cardImg.style.left = `${bounds.left}px`;
    cardImg.style.top = `${bounds.top}px`;
    cardImg.classList.add('card-image');
    return cardImg;
  };

  /**
   * Adds a player card to it's hand.
   * Draws the card to the screen and adds a score.
   * @param {object} card
   */
  const addPlayerCard = (card) => {
    userPickedCards.push(card);

    let playerCardsContainer = document.getElementById(
      'player-cards-container'
    );
    let bounds = calculateCardPosition(
      playerCardsContainer,
      cardStackingOffset
    );

    let playerCardImg = createCardElement(card, bounds);
    playerCardsContainer.appendChild(playerCardImg);

    let cardPlaceSound = new Audio('./Assets/Audio/cardPlace1.ogg');
    cardPlaceSound.play();

    playerScore += card.score;

    let playerScoreElement = document.getElementById('player-score');
    playerScoreElement.innerHTML = playerScore;
  };

  /**
   * Adds a computer card to it's hand.
   * Draws the card to the screen and adds a score.
   * @param {object} card
   */
  const addComputerCard = (card) => {
    computerPickedCards.push(card);

    let computerCardsContainer = document.getElementById(
      'computer-cards-container'
    );
    let bounds = calculateCardPosition(
      computerCardsContainer,
      cardStackingOffset
    );
    let computerCardImg = createCardElement(card, bounds);
    computerCardsContainer.appendChild(computerCardImg);

    let cardPlaceSound = new Audio('./Assets/Audio/cardPlace1.ogg');
    cardPlaceSound.play();

    computerScore += card.score;

    let computerScoreElement = document.getElementById('computer-score');
    computerScoreElement.innerHTML = computerScore;
  };

  /**
   * Checks if the player or the computer has won.
   * @param {boolean}  checkComputer, should we check the scores of the computer (the dealer) too?
   */
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

  buildCardDeck();
  startNewGame();

  document.getElementById('stop-button').addEventListener('click', () => {
    if (!isGameOver && userPickedCards.length > 0) {
      var drawCardInterval = null;
      drawCardInterval = setInterval(() => {
        let computerCard = drawACard();
        addComputerCard(computerCard);
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
        addPlayerCard(playerCard);
        checkScores(false);
      }
    }
  });

  document
    .getElementById('restart-button')
    .addEventListener('click', startNewGame);
})();
