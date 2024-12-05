const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let [rulesInput, updatesInput] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')

let beforeRules = new Map()
let afterRules = new Map()
for (let [n1, n2] of rulesInput.split('\n').map(nums)) {
  beforeRules.set(n1, (beforeRules.get(n1) ?? new Set()).add(n2))
  afterRules.set(n2, (afterRules.get(n2) ?? new Set()).add(n1))
}
let updates = updatesInput.split('\n').map(nums)

function isCorrect(update) {
  let afters = new Set(update.slice(1))
  let befores = new Set()
  for (let n of update) {
    if (
      (beforeRules.has(n) &&
        beforeRules.get(n).intersection(befores).size > 0) ||
      (afterRules.has(n) && afterRules.get(n).intersection(afters).size > 0)
    )
      return false
    befores.add(n)
    afters.delete(n)
  }
  return true
}

console.log('Part 1')
console.log(
  'answer:',
  updates
    .filter(isCorrect)
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((acc, num) => acc + num, 0)
)
console.log()

console.log('Part 2')
console.log(
  'answer:',
  updates
    .filter((update) => !isCorrect(update))
    .map(
      (update) =>
        update.sort((a, b) => {
          if (beforeRules.has(a) && beforeRules.get(a).has(b)) return -1
          if (afterRules.has(a) && afterRules.get(a).has(b)) return 1
        })[Math.floor(update.length / 2)]
    )
    .reduce((acc, num) => acc + num, 0)
)
