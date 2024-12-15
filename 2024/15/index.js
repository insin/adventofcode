const fs = require('fs')
const {add, dirs, getGrid, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)
let debug = process.argv[2] != null

let [mapInput, movesInput] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
let map = getGrid(mapInput)
let moves = movesInput.split('\n').join('').split('')

console.log('Part 1')
let botPos = map.findItem('@')
for (let dir of moves) {
  let delta = dirs[dir]
  let nextBotPos = add(botPos, delta)
  if (map.get(nextBotPos) == '.') {
    map.set('.', botPos)
    map.set('@', nextBotPos)
    botPos = nextBotPos
  } else if (map.get(nextBotPos) == 'O') {
    let boxesToMove = 1
    let lastBoxPos = add(nextBotPos, delta)
    while (map.get(lastBoxPos) == 'O') {
      boxesToMove++
      lastBoxPos = add(lastBoxPos, delta)
    }
    if (map.get(lastBoxPos) == '.') {
      map.set('.', botPos)
      map.set('@', nextBotPos)
      let boxPos = add(nextBotPos, delta)
      for (let i = 1; i <= boxesToMove; i++) {
        map.set('O', boxPos)
        boxPos = add(boxPos, delta)
      }
      botPos = nextBotPos
    }
  }
}
if (debug) map.print()
console.log(
  'answer:',
  sum(
    Array.from(map)
      .filter(({value}) => value == 'O')
      .map(({pos}) => 100 * pos[1] + pos[0])
  )
)
console.log()

console.log('Part 2')
console.log('answer:')
