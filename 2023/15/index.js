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
let boxes = Array.from(Array(256), () => ({}))

function printBoxes(step) {
  console.log(`After "${step}":`)
  for (let [index, box] of boxes.entries()) {
    if (Object.values(box).length > 0) {
      console.log(
        `Box ${index}: ${Object.entries(box)
          .map(([label, power]) => `[${label} ${power}]`)
          .join(' ')}`
      )
    }
  }
  console.log()
}

for (let step of steps) {
  let [_, label, op, power] = step.match(/(\w+)([=-])(\d)?/)
  let box = boxes[HASH(label)]
  if (op == '-') {
    delete box[label]
  } else {
    box[label] = Number(power)
  }
  if (debug) {
    printBoxes(_)
  }
}

console.log(
  'answer:',
  sum(
    boxes.map(
      (box, boxIndex) =>
        (boxIndex + 1) *
        sum(
          Array.from(
            Object.values(box),
            (power, lensIndex) => (lensIndex + 1) * power
          )
        )
    )
  )
)
