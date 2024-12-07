const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let equations = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map(nums)

console.log('Part 1')
let ops = [(total, n) => total + n, (total, n) => total * n]
function countPositions(target, totals, rest) {
  let next = rest.shift()
  let nextTotals = totals
    .map((total) => ops.map((op) => op(total, next)))
    .flat()
  if (rest.length == 0) {
    return nextTotals.filter((total) => total == target).length
  }
  return countPositions(target, nextTotals, rest)
}
let answer1 = 0
for (let [target, total, ...rest] of equations) {
  let positions = countPositions(target, [total], rest)
  if (positions > 0) {
    answer1 += target
  }
}
console.log('answer:', answer1)
console.log()

console.log('Part 2')
console.log('answer:')
