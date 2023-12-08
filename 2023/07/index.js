const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let cardStrength = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
}

let handStrength = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
}

let countsToHand = {
  5: 'FIVE_OF_A_KIND',
  4: 'FOUR_OF_A_KIND',
  23: 'FULL_HOUSE',
  3: 'THREE_OF_A_KIND',
  22: 'TWO_PAIR',
  2: 'ONE_PAIR',
  '': 'HIGH_CARD',
}

let wildUpgrades = {
  FOUR_OF_A_KIND: 'FIVE_OF_A_KIND',
  THREE_OF_A_KIND: 'FOUR_OF_A_KIND',
  TWO_PAIR: 'FULL_HOUSE',
  ONE_PAIR: 'THREE_OF_A_KIND',
  HIGH_CARD: 'ONE_PAIR',
}

function compareHands(a, b) {
  if (a.strength > b.strength) return -1
  if (a.strength < b.strength) return 1
  for (let i = 0; i < 5; i++) {
    if (a.cardStrengths[i] > b.cardStrengths[i]) return -1
    if (a.cardStrengths[i] < b.cardStrengths[i]) return 1
  }
  return 0
}

function scoreHands(hands) {
  return hands
    .reverse()
    .reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0)
}

console.log('Part 1')

let hands = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [cards, bid] = line.split(' ')
    let counts = new Map()
    let cardStrengths = []
    for (let card of cards.split('')) {
      counts.set(card, (counts.get(card) ?? 0) + 1)
      cardStrengths.push(cardStrength[card])
    }
    let hand =
      countsToHand[[...counts.values()].sort().join('').replace(/1/g, '')]
    return {
      cards,
      hand,
      strength: handStrength[hand],
      cardStrengths,
      bid: Number(bid),
    }
  })
  .sort(compareHands)

if (debug) {
  console.log('hands:', hands)
}

console.log('answer:', scoreHands(hands))
console.log()

console.log('Part 2')
cardStrength['J'] = 1
hands = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [cards, bid] = line.split(' ')
    let counts = new Map()
    let cardStrengths = []
    for (let card of cards.split('')) {
      counts.set(card, (counts.get(card) ?? 0) + 1)
      cardStrengths.push(cardStrength[card])
    }
    let hand
    if (!counts.has('J')) {
      hand =
        countsToHand[[...counts.values()].sort().join('').replace(/1/g, '')]
    } else {
      let wilds = counts.get('J')
      counts.delete('J')
      hand =
        countsToHand[[...counts.values()].sort().join('').replace(/1/g, '')]
      for (let i = 0; i < wilds; i++) {
        hand = wildUpgrades[hand] || hand
      }
    }
    return {
      cards,
      hand,
      strength: handStrength[hand],
      cardStrengths,
      bid: Number(bid),
    }
  })
  .sort(compareHands)

if (debug) {
  console.log(hands)
}

console.log('answer:', scoreHands(hands))
