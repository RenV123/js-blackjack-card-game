(() => {
  var cardDeck = [];
  var userPickedCards = []; //A list with all cards a user picked.
  var cardsPool = []; //Our pool with all the cards

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
  };

  const getRandomNr = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  buildCardDeck();
  startNewGame();

  document.getElementById('draw-card').addEventListener('click', () => {
    console.log(cardsPool);
    //draw a card
    if (cardsPool.length > 0) {
      let randIndex = getRandomNr(0, cardsPool.length);
      let randomCard = cardsPool[randIndex];
      console.log(`${randomCard.name} of ${randomCard.suit}`);

      //removes elements from startindex, nr of elements to remove.
      cardsPool.splice(randIndex, 1);
      userPickedCards.push(randomCard);

      document.getElementById('card-image').src = randomCard.url;
    }
  });
})();
