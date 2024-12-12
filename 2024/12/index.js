const fs = require('fs')
const {add, dirs, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let garden = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))

function key(pos) {
  return pos.join(',')
}

console.log('Part 1')
let answer1 = 0
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
      for (let delta of Object.values(dirs)) {
        let adjacentPos = add(plantPos, delta)
        if (garden.get(adjacentPos) != value) {
          radius++
        } else if (!seenPlots.has(key(adjacentPos))) {
          nextPlantsToCheck.push(adjacentPos)
          seenPlots.add(key(adjacentPos))
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
let answer2 = 0
seenPlots = new Set()
for (let {value, pos: plotStartPos} of garden) {
  if (seenPlots.has(key(plotStartPos))) continue
  seenPlots.add(key(plotStartPos))
  let plantsToCheck = [plotStartPos]
  /** @type {Record<string, Set<string>[]>} */
  let sides = Object.fromEntries(Object.keys(dirs).map((dir) => [dir, []]))
  let area = 1
  while (plantsToCheck.length > 0) {
    let nextPlantsToCheck = []
    for (let plantPos of plantsToCheck) {
      for (let [dir, delta] of Object.entries(dirs)) {
        let adjacentPos = add(plantPos, delta)
        if (garden.get(adjacentPos) != value) {
          let side = sides[dir].find((side) => {
            if (dir == '<' || dir == '>') {
              return (
                side.has(key(add(adjacentPos, [0, -1]))) ||
                side.has(key(add(adjacentPos, [0, 1])))
              )
            } else {
              return (
                side.has(key(add(adjacentPos, [-1, 0]))) ||
                side.has(key(add(adjacentPos, [1, 0])))
              )
            }
          })
          if (side) {
            side.add(key(adjacentPos))
          } else {
            sides[dir].push(new Set([key(adjacentPos)]))
          }
        } else if (!seenPlots.has(key(adjacentPos))) {
          nextPlantsToCheck.push(adjacentPos)
          seenPlots.add(key(adjacentPos))
          area++
        }
      }
    }
    plantsToCheck = nextPlantsToCheck
  }
  let sidesCount = Object.values(sides).flat().length
  if (debug) console.log(value, area, '×', sidesCount, '=', area * sidesCount)
  answer2 += area * sidesCount
}
console.log('answer:', answer2)
