const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let configs = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
  .map((lines) => {
    let [[ax, ay], [bx, by], [tx, ty]] = lines.split('\n').map(nums)
    return {ax, ay, bx, by, tx, ty}
  })

console.log('Part 1', configs)
let answer1 = 0
for (let {ax, ay, bx, by, tx, ty} of configs) {
  let hitCosts = []
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      if (a * ax + b * bx == tx && a * ay + b * by == ty) {
        hitCosts.push(a * 3 + b)
      }
    }
  }
  if (hitCosts.length > 0) {
    answer1 += Math.min(...hitCosts)
  }
}

console.log('answer:', answer1)
console.log()

console.log('Part 2')
console.log('answer:')
