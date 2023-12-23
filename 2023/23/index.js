const fs = require('fs')
const {add, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

/**
 * @type {Record<string, [number, number]>}
 */
let dirs = {
  ['^']: [0, -1],
  ['>']: [1, 0],
  ['v']: [0, 1],
  ['<']: [-1, 0],
}

let oppositeDirs = {
  ['^']: 'v',
  ['>']: '<',
  ['v']: '^',
  ['<']: '>',
}

let key = ([x, y], dir) => [x, y, dir].join(',')

/** @type {Map<string, number[]>} */
let stepCounts = new Map()
/** @type {[[number, number], string, number][]} */
let paths = [[[1, 0], 'v', 0]]
while (paths.length > 0) {
  /** @type {[[number, number], string, number][]} */
  let nextPaths = []
  for (let [pos, dir, steps] of paths) {
    for (let [nextPos, nextDir] of getPossibleMoves(pos, dir)) {
      let nextKey = key(nextPos, nextDir)
      let nextSteps = steps + 1
      stepCounts.set(nextKey, (stepCounts.get(nextKey) ?? []).concat(nextSteps))
      nextPaths.push([nextPos, nextDir, nextSteps])
    }
  }
  paths = nextPaths
}

/**
 * @param {[number, number]} pos
 * @param {string} dir
 * @return {[[number, number], string][]}
 */
function getPossibleMoves(pos, dir) {
  /** @type {[[number, number], string][]} */
  let possible = []

  // If the current space is an arrow we must go in that direction
  let gridDir = grid.at(pos)
  if (dirs[gridDir]) {
    // Unless we came from the opposite direction
    if (gridDir != oppositeDirs[dir]) {
      possible.push([add(pos, dirs[gridDir]), gridDir])
    }
  } else {
    for (let [nextDir, delta] of Object.entries(dirs)) {
      // Can't go in the direction we came from
      if (nextDir == oppositeDirs[dir]) continue
      let nextPos = add(pos, delta)
      // Not in the map
      if (!grid.contains(nextPos)) continue
      // Can't move through trees
      if (grid.at(nextPos) == '#') continue
      possible.push([nextPos, nextDir])
    }
  }

  return possible
}

if (debug) {
  console.log(
    'possible hikes:',
    stepCounts.get(`${grid.width - 2},${grid.height - 1},v`)
  )
}
console.log(
  'answer:',
  Math.max(...stepCounts.get(`${grid.width - 2},${grid.height - 1},v`))
)
console.log()

console.log('Part 2')
console.log('answer:')
