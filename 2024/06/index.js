const fs = require('fs')
const {add, dirs, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

const turns = {
  ['^']: '>',
  ['>']: 'v',
  ['v']: '<',
  ['<']: '^',
}

console.log('Part 1')
let initialPos = grid.findItem('^')
let pos = initialPos
let dir = '^'
do {
  let nextPos = add(pos, dirs[dir])
  if (grid.get(nextPos) == '#') {
    dir = turns[dir]
  } else {
    grid.set('X', pos)
    pos = nextPos
  }
} while (grid.contains(pos))
if (debug) grid.print()
console.log(
  'answer:',
  Array.from(grid).filter(({value}) => value == 'X').length
)
console.log()

console.log('Part 2')
function key(dir, pos) {
  return [dir, pos].join(',')
}
function cycles(grid) {
  let dir = '^'
  let pos = initialPos
  let seen = new Set()
  while (true) {
    if (seen.has(key(dir, pos))) return true
    seen.add(key(dir, pos))
    let nextPos = add(pos, dirs[dir])
    if (!grid.contains(nextPos)) return false
    if (grid.get(nextPos) == '#') {
      dir = turns[dir]
    } else {
      pos = nextPos
    }
  }
}
let cycleCount = 0
for (let {pos} of Array.from(grid).filter(({value}) => value == 'X')) {
  if (String(pos) == String(initialPos)) continue
  let testGrid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))
  testGrid.set('#', pos)
  if (cycles(testGrid)) cycleCount++
}
console.log('answer:', cycleCount)
