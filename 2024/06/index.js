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
let pos = grid.findItem('^')
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
console.log('answer:')
