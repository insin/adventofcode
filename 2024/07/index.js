const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let equations = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map(nums)

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

function solve() {
  let answer = 0
  for (let [target, total, ...rest] of equations) {
    let positions = countPositions(target, [total], rest)
    if (positions > 0) {
      answer += target
    }
  }
  return answer
}

console.log('Part 1')
console.log('answer:', solve())
console.log()

console.log('Part 2')
ops.push((total, n) => Number(`${total}${n}`))
console.log('answer:', solve())
