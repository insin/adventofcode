const fs = require('fs')
const {add, sidewaysDirs, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let garden = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
let answer1 = 0
let key = (pos) => pos.join(',')
let seenPlots = new Set()
for (let {value, pos: plotStartPos} of garden) {
  if (seenPlots.has(key(plotStartPos))) continue
  seenPlots.add(key(plotStartPos))
  let plantsToCheck = [plotStartPos]
  let area = 1
  let radius = 0
  while (plantsToCheck.length > 0) {
    let nextPlantsToCheck = []
    for (let plantPos of plantsToCheck) {
      for (let dir of sidewaysDirs) {
        let sidewaysPos = add(plantPos, dir)
        if (garden.get(sidewaysPos) != value) {
          radius++
        } else if (!seenPlots.has(key(sidewaysPos))) {
          nextPlantsToCheck.push(sidewaysPos)
          seenPlots.add(key(sidewaysPos))
          area++
        }
      }
    }
    plantsToCheck = nextPlantsToCheck
  }
  if (debug) console.log(value, area, '×', radius, '=', area * radius)
  answer1 += area * radius
}
console.log('answer:', answer1)
console.log()

console.log('Part 2')
console.log('answer:')
