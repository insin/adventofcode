const fs = require('fs')
const {diff, nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let reports = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map(nums)

console.log('Part 1')
let safe = reports.map(diff).filter((diffs) => {
  if (!diffs.every((n) => 3 - Math.abs(n) >= 0)) return false
  if (diffs[0] > 0) return diffs.every((n) => n > 0)
  return diffs.every((n) => n < 0)
}).length
console.log('answer:', safe)
console.log()

console.log('Part 2')
console.log('answer:')
