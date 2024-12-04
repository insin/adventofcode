const fs = require('fs')
const {add, deltas, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
let answer1 = 0
for (let {value, pos} of grid) {
  if (value != 'X') continue
  for (let delta of deltas) {
    if (
      grid.get(add(pos, delta, 1)) == 'M' &&
      grid.get(add(pos, delta, 2)) == 'A' &&
      grid.get(add(pos, delta, 3)) == 'S'
    ) {
      answer1++
    }
  }
}
console.log('answer:', answer1)
console.log()

console.log('Part 2')
let answer2 = 0
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
for (let {value, pos} of grid) {
  if (value != 'A') continue
  let mas = true
  for (let [delta1, delta2] of oppositeDiagonals) {
    let values = new Set([
      grid.get(add(pos, delta1)),
      grid.get(add(pos, delta2)),
    ])
    if (!(values.has('M') && values.has('S'))) {
      mas = false
      break
    }
  }
  if (mas) answer2++
}
console.log('answer:', answer2)
