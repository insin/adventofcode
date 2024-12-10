const fs = require('fs')
const {add, dirs, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

let answer1 = 0
let answer2 = 0
for (let start of grid) {
  if (start.value != '0') continue
  let currentHeight = 0
  let positions = [start.pos]
  while (currentHeight < 9 && positions.length > 0) {
    let nextPositions = []
    for (let pos of positions) {
      for (let dir of Object.values(dirs)) {
        if (grid.get(add(pos, dir)) == currentHeight + 1) {
          nextPositions.push(add(pos, dir))
        }
      }
    }
    positions = nextPositions
    currentHeight++
  }
  if (currentHeight == 9) {
    answer1 += new Set(positions.map((pos) => pos.join(','))).size
    answer2 += positions.length
  }
}
console.log('Part 1')
console.log('answer:', answer1)
console.log()
console.log('Part 2')
console.log('answer:', answer2)
