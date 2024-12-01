const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let lines = inputs.at(process.argv[2] == 'test' ? 0 : -1).split('\n')
let left = []
let right = []
let rightCount = {}
for (let line of lines) {
  let [ln, rn] = line.split('  ').map((n) => Number(n))
  left.push(ln)
  right.push(rn)
  rightCount[rn] = (rightCount[rn] ?? 0) + 1
}
left.sort()
right.sort()

console.log('Part 1')
let answer1 = 0
for (let i = left.length - 1; i >= 0; i--) {
  answer1 += Math.abs(left[i] - right[i])
}
console.log('answer:', answer1)

console.log()

console.log('Part 2')
let answer2 = 0
for (let ln of left) {
  if (rightCount[ln]) {
    answer2 += ln * rightCount[ln]
  }
}
console.log('answer:', answer2)
