const fs = require('fs')
const {add, deltas, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
console.log(
  'answer:',
  Array.from(grid)
    .filter(({value}) => value == 'X')
    .map(({pos}) =>
      deltas.filter(
        (delta) =>
          grid.get(add(pos, delta, 1)) == 'M' &&
          grid.get(add(pos, delta, 2)) == 'A' &&
          grid.get(add(pos, delta, 3)) == 'S'
      )
    )
    .flat().length
)
console.log()

console.log('Part 2')
/** @type {[number, number][][]} */
let oppositeDiagonals = [
  [
    [-1, -1], // left up
    [1, 1], // right down
  ],
  [
    [1, -1], // right up
    [-1, 1], // left down
  ],
]
console.log(
  'answer:',
  Array.from(grid).filter(
    ({value, pos}) =>
      value == 'A' &&
      oppositeDiagonals.every(([delta1, delta2]) => {
        let values = new Set([
          grid.get(add(pos, delta1)),
          grid.get(add(pos, delta2)),
        ])
        return values.has('M') && values.has('S')
      })
  ).length
)
