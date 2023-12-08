const fs = require('fs')
let inputs = ['example1', 'example2', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

console.log('Part 1')
let calibrationValues = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let digits = line.match(/\d/g)
    return Number(digits.at(0) + digits.at(-1))
  })
if (debug) {
  console.log('calibration values:', calibrationValues)
}
let answer = calibrationValues.reduce((acc, value) => acc + value, 0)
console.log('answer:', answer)
console.log()

console.log('Part 2')
let numbers = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}
calibrationValues = inputs
  .at(process.argv[2] == 'test' ? 1 : -1)
  .split('\n')
  .map((line) => {
    let digits = Array.from(
      line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g),
      (match) => numbers[match[1]] || match[1]
    )
    return Number(digits.at(0) + digits.at(-1))
  })
if (debug) {
  console.log('calibration values:', calibrationValues)
}
answer = calibrationValues.reduce((acc, value) => acc + value, 0)
console.log('answer:', answer)
