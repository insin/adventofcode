const fs = require('fs')
const {add, dirs, getGrid, oppositeDirs} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let maze = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
let initialDir = '>'
let initialPos = maze.findItem('S')
let endPos = maze.findItem('E')
/** @type {[string, [number, number], number][]} */
let moves = [[initialDir, initialPos, 0]]
let paths = new Map([[String(initialPos), 0]])
while (moves.length > 0) {
  /** @type {[string, [number, number], number][]} */
  let nextMoves = []
  for (let [dir, pos, cost] of moves) {
    for (let [nextDir, delta] of Object.entries(dirs)) {
      if (nextDir == oppositeDirs[dir] || maze.get(pos, delta) == '#') continue
      let nextPos = add(pos, delta)
      let nextCost = cost + (nextDir == dir ? 0 : 1000) + 1
      let key = String(nextPos)
      if (!paths.has(key) || nextCost < paths.get(key)) {
        paths.set(key, nextCost)
        if (maze.get(nextPos) != 'E') {
          nextMoves.push([nextDir, nextPos, nextCost])
        }
      }
    }
  }
  moves = nextMoves
}
console.log('answer:', paths.get(String(endPos)))
console.log()

console.log('Part 2')
console.log('answer:')
