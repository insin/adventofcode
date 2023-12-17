const fs = require('fs')
const {getGrid, hash, range, rotate, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null
let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1), Number)
let cache = new Map()

// corrent position
// current direction
// number of moves in current direction
// cost so far

// valid next moves:
// left (if in bounds and not visited before)
// right (if in bounds and not visited before)
// straight (if in bounds and not moved 3 yet

let deltas = {
  '>': {dx: 1},
  '<': {dx: -1},
  '^': {dy: -1},
  v: {dy: 1},
}

function outside(x, y) {
  return x < 0 || x == grid.width || y < 0 || y == grid.height
}

function findShortestPath(
  x, y,
  dir,
  length,
  visited,
  stepsInCurrentDirection = 1
) {
  let possibleDirections = dir == '>' || dir == '<' ? ['^', 'v'] : ['>', '<']
  if (stepsInCurrentDirection < 3) {
    possibleDirections.push(dir)
  }
  let nextMoves = possibleDirections.map(possibleDir => {
    let {dx = 0, dy = 0} = deltas[possibleDir]
    if (!outside(x + dx, y + dy) && !visited.has(`${x + dx},${y + dy}`)) {
      return [x + dx, y + dy, possibleDir]
    }
  }).filter(Boolean)

  if (nextMoves.length == 0) return null

  if (nextMoves.find(([x, y]) => x == grid.width - 1 && y == grid.height -1)) {
    return length + grid[grid.width - 1][grid.height - 1]
  }

  let pathLengths = nextMoves.map(([nextX, nextY, nextDir] =>
    findShortestPath(nextX, nextY, nextDir) // XX
  )
  for (let [nextX, nextY, nextDir] of nextMoves) {
    return Math.min(
      ...
    )
  }
}

findShortestPath([1, 0], '>', grid[1][0], new Set(['1,0']), 1)
findShortestPath([0, 1], 'v', grid[0][1], new Set(['0,1']), 1)

/**
 * @param {string} row
 * @param {number[]} sizes
 * @param {number} numberInCurrentGroup
 * @returns {number}
 */
function countSolutions(row, sizes, numberInCurrentGroup = 0) {
  let key = [row, sizes.join(','), numberInCurrentGroup].join('|')
  if (cache.has(key)) return cache.get(key)

  // Once all characters have been consumed, check if all groups are finished
  if (row == '') {
    let valid =
      // All groups were finished before the last character
      (sizes.length == 0 && numberInCurrentGroup == 0) ||
      // The last character finished the remaining group
      (sizes.length == 1 && numberInCurrentGroup == sizes[0])
    cache.set(key, valid ? 1 : 0)
    return cache.get(key)
  }

  let count = 0
  // Every time we hit a ?, try # or . in its place instead
  let next = row.charAt(0) == '?' ? ['#', '.'] : [row.charAt(0)]
  for (let char of next) {
    if (char == '#') {
      // Start a new group or extend the current group
      count += countSolutions(row.slice(1), sizes, numberInCurrentGroup + 1)
    } else {
      // If we're currently in a group
      if (numberInCurrentGroup > 0) {
        // Finish the group if we've reached its size
        if (sizes.length > 0 && sizes[0] == numberInCurrentGroup) {
          count += countSolutions(row.slice(1), sizes.slice(1))
        }
        // Otherwise, the solution we were checking is invalid - no more
        // characters will be checked, as we fall through to return, without
        // having added anything to the valid count.
      } else {
        // Move on to the next character
        count += countSolutions(row.slice(1), sizes)
      }
    }
  }
  cache.set(key, count)
  return count
}

console.log('Part 1')
// prettier-ignore
console.log('answer:')
console.log()

console.log('Part 2')
// prettier-ignore
console.log('answer:')
