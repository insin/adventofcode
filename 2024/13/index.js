const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let configs = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
  .map((lines) => {
    let [[ax, ay], [bx, by], [x, y]] = lines.split('\n').map(nums)
    return {ax, ay, bx, by, x, y}
  })

console.log('Part 1')
let answer1 = 0
for (let {ax, ay, bx, by, x, y} of configs) {
  let hitCosts = []
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      if (a * ax + b * bx == x && a * ay + b * by == y) {
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
/*
solve:
ax * A + bx * B = x (1)
ay * A + by * B = y (2)

redefine (1) in terms of B:
B = (x - ax * A) / bx (3)

substitute (3) into (2):
ay * A + by * ((x - ax * A) / bx) = y

distribute by so we can isolate A:
ay * A + (x * by) / bx - (ax * A * by) / bx = y

isolate A on the LHS:
ay * A - (ax * A * by) / bx = y - (x * by) / bx
A * (ay - ax * by / bx) = y - (x * by) / bx
A = (y - (x * by) / bx) / (ay - (ax * by) / bx)
*/
let answer2 = 0
for (let {ax, ay, bx, by, x, y} of configs) {
  x += 10000000000000
  y += 10000000000000
  let a = (y - (x * by) / bx) / (ay - (ax * by) / bx)
  let b = (x - ax * a) / bx
  // This specifically had to be .toFixed(3), .toFixed(4) excluded too many
  if (a.toFixed(3).includes('.000') && b.toFixed(3).includes('.000')) {
    answer2 += Math.round(a) * 3 + Math.round(b)
  }
}
console.log('answer:', answer2)
