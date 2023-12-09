const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let histories = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => line.split(' ').map(Number))

let answer1 = 0
let answer2 = 0
for (let current of histories) {
  let seqs = [current]
  do {
    let next = []
    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1])
    }
    seqs.push(next)
    current = next
  } while (!current.every((diff) => diff == 0))

  for (let i = seqs.length - 2; i >= 0; i--) {
    seqs[i].push(seqs[i].at(-1) + seqs[i + 1].at(-1))
    seqs[i].unshift(seqs[i].at(0) - seqs[i + 1].at(0))
  }
  if (debug) {
    console.log(seqs)
  }
  answer1 += seqs[0].at(-1)
  answer2 += seqs[0].at(0)
}

console.log('Part 1')
console.log('answer:', answer1)
console.log()
console.log('Part 2')
console.log('answer:', answer2)
