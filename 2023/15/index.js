const fs = require('fs')
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
console.log(
  'answer:',
  steps.reduce((acc, step) => acc + HASH(step), 0)
)
console.log()

console.log('Part 2')
console.log('answer:')
