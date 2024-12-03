const fs = require('fs')

let inputs = ['example1', 'example2', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)
let program = inputs.at(process.argv[2] == 'test' ? 1 : -1)

console.log('Part 1')
let answer1 = 0
for (let match of program.matchAll(/mul\((\d+),(\d+)\)/g)) {
  answer1 += Number(match[1]) * Number(match[2])
}
console.log('answer:', answer1)
console.log()

console.log('Part 2')
let answer2 = 0
let active = true
for (let match of program.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)) {
  if (match[0] == 'do()') {
    active = true
  } else if (match[0] == "don't()") {
    active = false
  } else if (active) {
    answer2 += Number(match[1]) * Number(match[2])
  }
}
console.log('answer:', answer2)
