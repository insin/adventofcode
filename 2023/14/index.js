const fs = require('fs')
const {getGrid, range} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let {grid} = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')

/**
 * @param {'N' | 'E' | 'S' | 'W'} dir
 */
function roll(dir) {
  if (dir == 'N' || dir == 'S') {
    let dFreey = dir == 'N' ? 1 : -1
    for (let x = 0; x < grid.width; x++) {
      let freeY = null
      let ys = dir == 'N' ? range(grid.height) : range(grid.height).reverse()
      for (let y of ys) {
        switch (grid[x][y]) {
          case '.': {
            if (freeY == null) {
              freeY = y
            }
            break
          }
          case '#': {
            freeY = null
            break
          }
          case 'O': {
            if (freeY != null) {
              grid[x][freeY] = 'O'
              grid[x][y] = '.'
              if (grid[x][freeY + dFreey] == '.') {
                freeY += dFreey
              } else {
                freeY = null
              }
            }
            break
          }
        }
      }
    }
  }
  if (dir == 'E' || dir == 'W') {
    let dFreeX = dir == 'W' ? 1 : -1
    for (let y = 0; y < grid.width; y++) {
      let freeX = null
      let xs = dir == 'W' ? range(grid.length) : range(grid.length).reverse()
      for (let x of xs) {
        switch (grid[x][y]) {
          case '.': {
            if (freeX == null) {
              freeX = x
            }
            break
          }
          case '#': {
            freeX = null
            break
          }
          case 'O': {
            if (freeX != null) {
              grid[freeX][y] = 'O'
              grid[x][y] = '.'
              if (grid[freeX + dFreeX] && grid[freeX + dFreeX][y] == '.') {
                freeX += dFreeX
              } else {
                freeX = null
              }
            }
            break
          }
        }
      }
    }
  }
}

function weight() {
  return grid.reduce(
    (acc1, col) =>
      acc1 +
      col.reduce(
        (acc2, item, index) => acc2 + (item == 'O' ? col.length - index : 0),
        0
      ),
    0
  )
}

roll('N')
if (debug) {
  grid.print()
}

console.log('answer:', weight())
console.log()

console.log('Part 2')
let cycleCount = 0
let lastSeen = new Map()
let firstLoop = null
let cycleLength = null

function nextCycle() {
  if (cycleCount > 0) {
    roll('N')
  }
  roll('W')
  roll('S')
  roll('E')
  cycleCount++

  let hash = grid.hash()
  if (lastSeen.has(hash)) {
    if (firstLoop == null) {
      firstLoop = cycleCount
      cycleLength = cycleCount - lastSeen.get(hash)
      if (debug) {
        console.log(
          'Cycle',
          cycleCount,
          'last seen',
          cycleCount - lastSeen.get(hash),
          ' ago',
          {firstLoop}
        )
      }
    }
  }
  lastSeen.set(hash, cycleCount)
}

function printCycle() {
  console.log(`Cycle ${cycleCount}`)
  grid.print()
  console.log()
}

if (debug) {
  while (cycleCount < 3) {
    nextCycle()
    printCycle()
  }
}

while (!firstLoop) {
  nextCycle()
}

let offset = (1_000_000_000 - firstLoop) % cycleLength
for (let i = 0; i < offset; i++) {
  nextCycle()
}

console.log('answer:', weight())
