const fs = require('fs')
const {diff, nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let reports = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map(nums)

function isSafe(report) {
  let diffs = diff(report)
  if (!diffs.every((n) => 3 - Math.abs(n) >= 0)) return false
  if (diffs[0] > 0) return diffs.every((n) => n > 0)
  return diffs.every((n) => n < 0)
}

console.log('Part 1')
console.log('answer:', reports.filter(isSafe).length)
console.log()

console.log('Part 2')
let safe = 0
for (let report of reports) {
  if (isSafe(report)) {
    safe++
  } else {
    for (let i = 0; i < report.length; i++) {
      if (isSafe(report.filter((_, index) => index != i))) {
        safe++
        break
      }
    }
  }
}
console.log('answer:', safe)
