const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let [rulesInput, updatesInput] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')

let beforeRules = new Map()
for (let [n1, n2] of rulesInput.split('\n').map(nums)) {
  beforeRules.set(n1, (beforeRules.get(n1) ?? new Set()).add(n2))
}
let updates = updatesInput.split('\n').map(nums)

function isCorrect(update) {
  let befores = new Set()
  for (let n of update) {
    if (beforeRules.has(n) && beforeRules.get(n).intersection(befores).size > 0)
      return false
    befores.add(n)
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
        })[Math.floor(update.length / 2)]
    )
    .reduce((acc, num) => acc + num, 0)
)
