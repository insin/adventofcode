const fs = require('fs')
const {nums, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let stones = nums(inputs.at(process.argv[2] == 'test' ? 0 : -1))

console.log('Part 1')
let currentStones = stones.slice()
for (let blinks = 1; blinks <= 25; blinks++) {
  let nextStones = []
  for (let stone of currentStones) {
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
  currentStones = nextStones
}
console.log('answer:', currentStones.length)
console.log()

console.log('Part 2')
/** @type {Map<number, number>} */
let counts = new Map(stones.map((stone) => [stone, 1]))
for (let blinks = 1; blinks <= 75; blinks++) {
  let nextCounts = new Map()
  for (let [stone, count] of counts) {
    if (stone == 0) {
      nextCounts.set(1, (nextCounts.get(1) ?? 0) + count)
    } else if (String(stone).length % 2 == 0) {
      let str = String(stone)
      let stone1 = Number(str.substring(0, str.length / 2))
      let stone2 = Number(str.slice(str.length / 2))
      nextCounts.set(stone1, (nextCounts.get(stone1) ?? 0) + count)
      nextCounts.set(stone2, (nextCounts.get(stone2) ?? 0) + count)
    } else {
      nextCounts.set(stone * 2024, (nextCounts.get(stone * 2024) ?? 0) + count)
    }
  }
  counts = nextCounts
}
console.log('answer:', sum(Array.from(counts.values())))
