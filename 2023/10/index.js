const fs = require('fs')
let inputs = [
  'example1',
  'example2',
  'example3',
  'example4',
  'example5',
  'input',
].map((file) => fs.readFileSync(`${file}.txt`, 'utf-8'))

let debug = process.argv[2] != null

let connections = {
  '|': new Set(['N', 'S']),
  '-': new Set(['E', 'W']),
  L: new Set(['N', 'E']),
  J: new Set(['N', 'W']),
  7: new Set(['S', 'W']),
  F: new Set(['S', 'E']),
}

let grid = inputs
  .at(process.argv[2] == 'test' ? 4 : -1)
  .split('\n')
  .map((line) => line.split(''))

let distances = Array.from(grid, () => Array.from(grid[0], () => '.'))
let map = Array.from(grid, () => Array.from(grid[0], () => '.'))

function print(grid) {
  console.log(grid.map((squares) => squares.join('')).join('\n'))
  console.log()
}

function getAdjacent(pos) {
  return [
    pos.y > 0 && ['N', {y: pos.y - 1, x: pos.x}],
    pos.x < grid[0].length - 1 && ['E', {y: pos.y, x: pos.x + 1}],
    pos.y < grid.length - 1 && ['S', {y: pos.y + 1, x: pos.x}],
    pos.x > 0 && ['W', {y: pos.y, x: pos.x - 1}],
  ].filter(Boolean)
}

let opposite = {
  N: 'S',
  E: 'W',
  S: 'N',
  W: 'E',
}

console.log('Part 1')

function solve() {
  let stepCount = 0

  // Start from S
  let fromPositions
  for (let y = 0; y < grid.length; y++) {
    let x = grid[y].indexOf('S')
    if (x != -1) {
      fromPositions = [{x, y}]
      break
    }
  }
  // XXX hard-coding for my input where S was eplaced by its actual symbol
  if (process.argv[2] != 'test') {
    fromPositions = [{x: 40, y: 115}]
  }

  let finished = false
  while (!finished) {
    let toPositions = []
    for (let {x: fromX, y: fromY, prev} of fromPositions) {
      let from = grid[fromY][fromX]
      distances[fromY][fromX] = stepCount
      for (let [dir, {x: toX, y: toY}] of getAdjacent({x: fromX, y: fromY})) {
        let to = grid[toY][toX]
        if (to == '.') continue
        if (prev && prev.x == toX && prev.y == toY) continue
        let connectsTo = to == 'S' || connections[to].has(opposite[dir])
        let connectsFrom = from == 'S' || connections[from].has(dir)
        if (connectsFrom && connectsTo) {
          toPositions.push({x: toX, y: toY, prev: {x: fromX, y: fromY}})
        }
      }
    }
    // Finish when we reach a spot we've already visited
    if (toPositions.some(({x, y}) => distances[y][x] != '.')) {
      finished = true
    } else {
      fromPositions = toPositions
      stepCount++
    }
  }

  return stepCount
}

console.log('answer:', solve())
console.log()

console.log('Part 2')

let enclosed = 0
for (let [y, rows] of distances.entries()) {
  let counting = false
  for (let [x, stepCount] of rows.entries()) {
    if (stepCount != '.') {
      map[y][x] = grid[y][x]
      let goingUpOrDown = /(\||L-*7|F-*J)$/.test(
        map[y].slice(0, x + 1).join('')
      )
      if (goingUpOrDown) {
        counting = !counting
      }
    } else if (counting) {
      enclosed++
      map[y][x] = 'I'
    }
  }
}

print(map)

console.log('answer:', enclosed)
