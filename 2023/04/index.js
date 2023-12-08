const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let cards = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [winning, have] = line
      .split(':')[1]
      .split('|')
      .map((numbers) => numbers.match(/\d+/g))
    return {winners: have.filter((n) => winning.includes(n)).length}
  })

console.log('Part 1')
let answer = cards.reduce((acc, {winners}, index) => {
  let score = winners > 0 ? Math.pow(2, winners - 1) : 0
  if (debug) {
    console.log('Card ' + (index + 1), {winners, score})
  }
  return acc + score
}, 0)
console.log('answer:', answer)
console.log()

console.log('Part 2')
let copies = Array(cards.length).fill(1)
for (let [index, {winners}] of cards.entries()) {
  for (let i = 1; i <= winners; i++) {
    copies[index + i] += copies[index]
  }
  if (debug) {
    console.log('Card ' + (index + 1), {winners, copies: copies[index]})
  }
}
copies.splice(cards.length)
answer = copies.reduce((acc, count) => acc + count)
console.log('answer:', answer)
