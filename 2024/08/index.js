const fs = require('fs')
const {add, getGrid, uniquePairs} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))
/** @type {Map<string, [number, number][]>} */
let antennas = new Map()
for (let {value, pos} of grid) {
  if (value == '.') continue
  if (!antennas.has(value)) {
    antennas.set(value, [pos])
  } else {
    antennas.get(value).push(pos)
  }
}

console.log('Part 1')
for (let positions of antennas.values()) {
  for (let [a, b] of uniquePairs(positions)) {
    let delta = [a[0] - b[0], a[1] - b[1]]
    let antinode1 = add(a, delta)
    if (grid.contains(antinode1)) grid.set('#', antinode1)
    let antinode2 = add(b, delta, -1)
    if (grid.contains(antinode2)) grid.set('#', antinode2)
  }
}
if (debug) grid.print()
console.log(
  'answer:',
  Array.from(grid).filter(({value}) => value == '#').length
)
console.log()

console.log('Part 2')
console.log('answer:')
