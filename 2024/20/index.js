const fs = require('fs')
const {add, dirs, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let track = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))
let startPos = track.findItem('S')
let endPos = track.findItem('E')

console.log('Part 1')
let stepsToPos = new Map([[String(startPos), 0]])
let steps = 0
let pos = startPos
while (String(pos) != String(endPos)) {
  for (let delta of Object.values(dirs)) {
    let nextPos = add(pos, delta)
    if (
      !stepsToPos.has(String(nextPos)) &&
      (track.get(nextPos) == '.' || track.get(nextPos) == 'E')
    ) {
      steps++
      stepsToPos.set(String(nextPos), steps)
      pos = nextPos
      break
    }
  }
}
/** @type {Map<number, number>} */
let savings = new Map()
for (let [key, steps] of stepsToPos) {
  if (key == String(endPos)) continue
  let pos = /** @type {[number, number]} */ (key.split(',').map(Number))
  for (let delta of Object.values(dirs)) {
    if (
      track.get(pos, delta, 1) == '#' &&
      (track.get(pos, delta, 2) == '.' || track.get(pos, delta, 2) == 'E')
    ) {
      let cheatPos = add(pos, delta, 2)
      let cheatSteps = stepsToPos.get(String(cheatPos))
      // Only consider cheats which get you further in fewer steps
      if (cheatSteps > steps + 2) {
        let saving = cheatSteps - steps - 2
        savings.set(saving, (savings.get(saving) ?? 0) + 1)
      }
    }
  }
}
let answer1 = 0
for (let [saving, count] of savings) {
  if (saving >= 100) answer1 += count
}
console.log('answer:', answer1)
console.log()

console.log('Part 2')
console.log('answer:')
