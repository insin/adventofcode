const fs = require('fs')
const {add, dirs, oppositeDirs, getGrid, nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

/** @type {[number, number][]} */
let bytes = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [x, y] = nums(line)
    return [x, y]
  })
let size = process.argv[2] == 'test' ? 7 : 71
let simulatePart1 = process.argv[2] == 'test' ? 12 : 1024
let endPos = [size - 1, size - 1]
let grid = getGrid(Array(size).fill('.'.repeat(size)).join('\n'))

function walk() {
  /** @type {Map<string, number>} */
  let costs = new Map()
  /** @type {[[number, number], number][]} */
  let moves = [[[0, 0], 0]]
  let endPos = [size - 1, size - 1]
  while (moves.length > 0) {
    /** @type {typeof moves} */
    let nextMoves = []
    for (let [pos, cost] of moves) {
      for (let delta of Object.values(dirs)) {
        let nextPos = add(pos, delta)
        if (!grid.contains(nextPos) || grid.get(nextPos) == '#') continue
        let key = String(nextPos)
        if (!costs.has(key) || cost + 1 < costs.get(key)) {
          costs.set(key, cost + 1)
          if (String(nextPos) != String(endPos)) {
            nextMoves.push([nextPos, cost + 1])
          }
        }
      }
    }
    moves = nextMoves
  }
  return costs
}

console.log('Part 1')
for (let i = 0; i < simulatePart1; i++) {
  grid.set('#', bytes[i])
}

console.log('answer:', walk().get(String(endPos)))
console.log()

console.log('Part 2')
grid = getGrid(Array(size).fill('.'.repeat(size)).join('\n'))
for (let byte of bytes) {
  grid.set('#', byte)
  if (!walk().has(String(endPos))) {
    console.log('answer:', String(byte))
    break
  }
}
