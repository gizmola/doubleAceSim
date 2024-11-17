// Odds on being dealt 2 aces in a row, with shuffled Deck.
const minSims = 1;
const maxSims = 1000;
const defaultKSims = 10;
let kSims = defaultKSims;

function getKSims(value) {
    const i = parseInt(value);
    if ((i == NaN) ||
    (i < minSims) ||
    (i > maxSims)) {
        return defaultKSims;
    }
    return i;
}

// Get URL Parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('ksims')) {
    console.log(urlParams.get('ksims'));
    kSims = getKSims(urlParams.get('ksims'));    
}
const elKSimsInput = document.getElementById('ksims');
elKSimsInput.value = kSims;

const elKSims = document.getElementsByClassName('ksims');
const realSims = 1000 * kSims;
Array.from(elKSims).forEach(e => e.textContent = kSims);

const addCardImg = (elParentDiv, suit) => {
    console.log('Suit:' + suit);
    let elImg = document.createElement('img');
    elImg.setAttribute('class', 'simulation__card');
    elImg.setAttribute('src', cardImages[suit]);
    elParentDiv.appendChild(elImg);
}
const cardImages = ['/img/ace_hearts.svg', '/img/ace_clubs.svg', '/img/ace_diamonds.svg', '/img/ace_spades.svg'];

let oddsShuffled = Number.parseFloat(Math.pow(4/52, 2) * 100).toFixed(2);
const elShuffleOdds = document.getElementsByClassName('odds-reshuffled');
console.log(elShuffleOdds);
Array.from(elShuffleOdds).forEach(e => e.textContent = `${oddsShuffled}%`);

console.log('Odds for 2 Aces, Shuffled Deck');
console.log(`${oddsShuffled}%`);

let oddsUnshuffled = Number.parseFloat(((4/52) * (3/51)) * 100).toFixed(2);
const elUnshuffledOdds = document.getElementsByClassName('odds-samedeck');
Array.from(elUnshuffledOdds).forEach(e => e.textContent = `${oddsUnshuffled}%`);

console.log('Odds for 2 Aces, Not Shuffling Deck');
console.log(`${oddsUnshuffled}%`);

class Deck {
    constructor() {
        this.cards = [];
        this.init();
    }

    // Fisher-Yates (Knuth) Shuffle
    shuffle(array) {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          // Using es6 destructuring here
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    init() {
        this.cards = this.range(52, 1);
        this.shuffle(this.cards);
    }

    range(size, startIdx = 0) {
        return [...Array(size).keys()].map(i => i + startIdx);
    }

    dealCard(reinit = true) {
        const card = this.cards.shift(); 

        if (reinit) {
            this.init();
        }
        return {
            'card': card,
            'suit': Math.floor(card / 13),
            'suitCard': card % 13
        };     
    }
}

let deck = new Deck();
let doubleAceCount = 0;

// simulator
// Runs simulation and updates Card display and sets total
const runSim = (deck, sims, elDeck, shuffle=true) => {
    let doubleAceCount = 0;

    for (let x = 0; x < sims; x++) {
        const card = deck.dealCard(shuffle);
        if (card.suitCard == 1) {
            const card2 = deck.dealCard(shuffle);
            if (card2.suitCard == 1) {
                doubleAceCount += 1;
                addCardImg(elDeck, card.suit);
                addCardImg(elDeck, card2.suit);
            }
        }
        deck.init();
    }
    return doubleAceCount;
}

// Reshuffle Sim
const elReshuffledeck = document.getElementById('reshuffledeck');
const elReshuffledeckActual = document.getElementById('reshuffledeck-actual');
const elReshuffledeckAces = document.getElementById('reshuffledeck-aces');
doubleAceCount = runSim(deck, realSims, elReshuffledeck);
elReshuffledeckAces.textContent = doubleAceCount;
elReshuffledeckActual.textContent = Number.parseFloat(doubleAceCount/realSims * 100).toFixed(2) + '%';


const elSamedeck = document.getElementById('samedeck');
const elSamedeckActual = document.getElementById('samedeck-actual');
const elSamedeckAces = document.getElementById('samedeck-aces');
doubleAceCount = runSim(deck, realSims, elSamedeck, false);
elSamedeckActual.textContent = Number.parseFloat(doubleAceCount/realSims * 100).toFixed(2) + '%';
elSamedeckAces.textContent = doubleAceCount;

const refreshButton = document.querySelector('.control__button');
const refreshPage = () => {
  window.location.href = (window.location.href.split('?')[0]) + "?ksims=" + elKSimsInput.value;  
}
refreshButton.addEventListener('click', refreshPage)