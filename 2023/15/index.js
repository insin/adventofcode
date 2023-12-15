const fs = require('fs')
const {sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let steps = inputs.at(process.argv[2] == 'test' ? 0 : -1).split(',')

function HASH(s) {
  let currentValue = 0
  for (let i = 0; i < s.length; i++) {
    currentValue += s.charCodeAt(i)
    currentValue *= 17
    currentValue %= 256
  }
  return currentValue
}

console.log('Part 1')
if (debug) {
  console.log('HASH(HASH)', '=', HASH('HASH'))
}
console.log('answer:', sum(steps.map(HASH)))
console.log()

console.log('Part 2')
let boxes = Array.from(new Array(256), () => [])
for (let step of steps) {
  let [raw, label, op, power] = step.match(/(\w+)([=-])(\d)?/)
  let boxIndex = HASH(label)
  let lensIndex = boxes[boxIndex].findIndex((lens) => lens.label == label)
  if (op == '-') {
    if (lensIndex != -1) {
      boxes[boxIndex].splice(lensIndex, 1)
    }
  } else {
    if (lensIndex == -1) {
      boxes[boxIndex].push({label, power})
    } else {
      boxes[boxIndex][lensIndex] = {label, power}
    }
  }
  if (debug) {
    console.log(`After "${raw}":`)
    for (let [index, box] of boxes.entries()) {
      if (box.length > 0) {
        console.log(
          `Box ${index}: ${box
            .map(({label, power}) => `[${label} ${power}]`)
            .join(' ')}`
        )
      }
    }
    console.log()
  }
}
console.log(
  'answer:',
  sum(
    boxes.map(
      (box, boxIndex) =>
        (boxIndex + 1) *
        sum(box.map((lens, lensIndex) => (lensIndex + 1) * lens.power))
    )
  )
)
