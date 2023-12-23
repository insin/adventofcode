const fs = require('fs')
const {add, dirs, getGrid, oppositeDirs} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

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
function getPossibleMoves(pos, dir, ignoreArrows = false) {
  /** @type {[[number, number], string][]} */
  let possible = []

  // If the current space is an arrow we must go in that direction
  let gridDir = grid.at(pos)
  if (!ignoreArrows && dirs[gridDir]) {
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

let start = '1,0'
let end = `${grid.width - 2},${grid.height - 1}`
let junctions = new Set([start, end])
for (let x = 0; x < grid.width; x++) {
  for (let y = 0; y < grid.height; y++) {
    if (grid.at([x, y]) == '#') continue
    let possibles = []
    for (let delta of Object.values(dirs)) {
      let pos = add([x, y], delta)
      if (grid.contains(pos) && grid.at(pos) != '#') {
        possibles.push(grid.at(pos))
      }
    }
    if (possibles.length > 2) {
      junctions.add([x, y].join(','))
    }
  }
}

let junctionDistances = new Map()
for (let junction of junctions) {
  let pos = junction.split(',').map(Number)
  let distances = new Map()
  /** @type {[[number, number], string, number][]} */
  let paths = [[pos, '', 0]]
  while (paths.length > 0) {
    /** @type {[[number, number], string, number][]} */
    let next = []
    for (let [pos, dir, steps] of paths) {
      for (let [nextPos, nextDir] of getPossibleMoves(pos, dir, true)) {
        if (junctions.has(nextPos.join(','))) {
          distances.set(nextPos.join(','), steps + 1)
        } else {
          next.push([nextPos, nextDir, steps + 1])
        }
      }
    }
    paths = next
  }
  junctionDistances.set(junction, distances)
}

let longest = 0
function findLongest(junction, seen, steps) {
  if (junction == end) {
    if (steps > longest) {
      longest = steps
    }
    return
  }

  for (let [next, distance] of junctionDistances.get(junction).entries()) {
    if (seen.has(next)) continue
    findLongest(next, new Set([...seen, next]), steps + distance)
  }
}

findLongest(start, new Set([start]), 0)
console.log('answer:', longest)
