/**
 * Another learning day today - this time for Djikstra!
 *
 * My initial attempt had many of the right small pieces like figuring out
 * possible next directons, but it was DFS recursion which never seemed to
 * finish.
 *
 * The main parts I was missing were storing the lowest total heat loss seen
 * separately from the moves, and using that to chop down which paths we keep
 * looking at in a BFS fashion. I used this solution as a reference:
 *
 * https://gist.github.com/knutel/275c3eb088b0359ed058dfb56a9d9896
 */
const fs = require('fs')
const {getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

/**
 * @param {[number, number]} pos
 * @param {[number, number]} delta
 */
function add(pos, delta) {
  return [pos[0] + delta[0], pos[1] + delta[1]]
}

let deltas = {
  '>': [1, 0],
  '<': [-1, 0],
  '^': [0, -1],
  v: [0, 1],
}

let key = (x, y, dir, stepsInCurrentDirection) =>
  [x, y, dir, stepsInCurrentDirection].join(',')

/** @typedef {[[number, number], string, number]} Move */

function getHeatLosses(getPossibleDirs) {
  /** @type {Move[]} */
  let moves = [
    [[1, 0], '>', 1],
    [[0, 1], 'v', 1],
  ]
  let heatLoss = new Map([
    [key(1, 0, '>', 1), Number(grid.at([1, 0]))],
    [key(0, 1, 'v', 1), Number(grid.at([0, 1]))],
  ])
  while (moves.length > 0) {
    /** @type {Move[]} */
    let nextMoves = []
    for (let move of moves) {
      let [[x, y], dir, stepsInCurrentDirection] = move
      for (let nextDir of getPossibleDirs(dir, stepsInCurrentDirection)) {
        let [nextX, nextY] = add([x, y], deltas[nextDir])
        if (!grid.contains([nextX, nextY])) {
          continue
        }
        let nextSteps = nextDir == dir ? stepsInCurrentDirection + 1 : 1
        let nextKey = key(nextX, nextY, nextDir, nextSteps)
        let nextHeatLoss =
          heatLoss.get(key(x, y, dir, stepsInCurrentDirection)) +
          Number(grid.at([nextX, nextY]))
        if (!heatLoss.has(nextKey) || nextHeatLoss < heatLoss.get(nextKey)) {
          heatLoss.set(nextKey, nextHeatLoss)
          nextMoves.push([[nextX, nextY], nextDir, nextSteps])
        }
      }
    }
    moves = nextMoves
  }
  return heatLoss
}

console.log('Part 1')
let heatLoss1 = getHeatLosses((dir, stepsInCurrentDirection) => {
  let dirs = dir == '>' || dir == '<' ? ['v', '^'] : ['>', '<']
  if (stepsInCurrentDirection < 3) {
    dirs.unshift(dir)
  }
  return dirs
})
console.log(
  'answer:',
  Math.min(
    ...[...heatLoss1.keys()]
      .filter((key) => key.startsWith(`${grid.width - 1},${grid.height - 1}`))
      .map((key) => heatLoss1.get(key))
  )
)
console.log()

console.log('Part 2')
let heatLoss2 = getHeatLosses((dir, stepsInCurrentDirection) => {
  if (stepsInCurrentDirection < 4) {
    return [dir]
  }
  let dirs = dir == '>' || dir == '<' ? ['v', '^'] : ['>', '<']
  if (stepsInCurrentDirection < 10) {
    dirs.unshift(dir)
  }
  return dirs
})
console.log(
  'answer:',
  Math.min(
    ...[...heatLoss2.keys()]
      .filter(
        (key) =>
          key.startsWith(`${grid.width - 1},${grid.height - 1}`) &&
          Number(key.split(',').at(-1)) >= 4
      )
      .map((key) => heatLoss2.get(key))
  )
)
