const fs = require('fs')
const {uniquePairs} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => line.split(''))

let expandedY = [...grid.keys()].filter((y) =>
  grid[y].every((item) => item == '.')
)
let expandedX = [...grid[0].keys()].filter((x) =>
  grid.every((row) => row[x] == '.')
)

function getGalaxies(expansionSize) {
  let galaxies = []
  let id = 1
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == '#') {
        galaxies.push({
          id: id++,
          x: expandedX.reduce(
            (acc, expanded) => (x > expanded ? acc + expansionSize - 1 : acc),
            x
          ),
          y: expandedY.reduce(
            (acc, expanded) => (y > expanded ? acc + expansionSize - 1 : acc),
            y
          ),
        })
      }
    }
  }
  return galaxies
}

function shortestPath(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

console.log('Part 1')
let part1Galaxies = getGalaxies(2)
if (debug) {
  console.log('1 to 7', shortestPath(part1Galaxies[0], part1Galaxies[6]))
  console.log('3 to 6', shortestPath(part1Galaxies[2], part1Galaxies[5]))
  console.log('8 to 9', shortestPath(part1Galaxies[7], part1Galaxies[8]))
}
console.log(
  'answer:',
  uniquePairs(part1Galaxies).reduce(
    (acc, [a, b]) => acc + shortestPath(a, b),
    0
  )
)
console.log()

console.log('Part 2')
let part2Galaxies = getGalaxies(1_000_000)
console.log(
  'answer:',
  uniquePairs(part2Galaxies).reduce(
    (acc, [a, b]) => acc + shortestPath(a, b),
    0
  )
)
