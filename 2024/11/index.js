const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let stones = nums(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
for (let blinks = 1; blinks <= 25; blinks++) {
  let nextStones = []
  for (let stone of stones) {
    if (stone == 0) {
      nextStones.push(1)
    } else if (String(stone).length % 2 == 0) {
      let str = String(stone)
      nextStones.push(Number(str.substring(0, str.length / 2)))
      nextStones.push(Number(str.slice(str.length / 2)))
    } else {
      nextStones.push(stone * 2024)
    }
  }
  stones = nextStones
}
console.log('answer:', stones.length)
console.log()

console.log('Part 2')
console.log('answer:')
