const fs = require('fs')
const {add, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let grid = getGrid(inputs.at(process.argv[2] == 'test' ? 0 : -1))
let start = grid.findItem('S')

/** @type {[number, number][]} */
let directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function part1() {
  /** @type {[number, number][]} */
  let possibles = [start]
  let steps = 0
  let targetSteps = process.argv[2] == 'test' ? 6 : 64
  do {
    let next = []
    let seen = new Set()
    while (possibles.length > 0) {
      let pos = possibles.pop()
      for (let delta of directions) {
        let nextPos = add(pos, delta)
        let key = nextPos.join(',')
        if (grid.contains(nextPos) && grid.at(nextPos) != '#') {
          if (!seen.has(key)) {
            next.push(nextPos)
            seen.add(key)
          }
        }
      }
    }
    steps++
    possibles = next
    if (debug) {
      console.log(steps, '→', possibles.length)
    }
  } while (steps < targetSteps)
  return possibles.length
}

function part2() {
  /** @type {[number, number][]} */
  let possibles = [start]
  let steps = 0
  let sampleCounts = []
  let sampleCountTarget = 4
  do {
    let next = []
    let seen = new Set()
    while (possibles.length > 0) {
      let pos = possibles.pop()
      for (let delta of directions) {
        let nextPos = add(pos, delta)
        /** @type {[number, number]} */
        let checkPos = [
          nextPos[0] >= 0
            ? nextPos[0] % grid.width
            : (grid.width - (Math.abs(nextPos[0]) % grid.width)) % grid.width,
          nextPos[1] >= 0
            ? nextPos[1] % grid.height
            : (grid.height - (Math.abs(nextPos[1]) % grid.height)) %
              grid.height,
        ]
        let key = nextPos.join(',')
        if (grid.at(checkPos) != '#') {
          if (!seen.has(key)) {
            next.push(nextPos)
            seen.add(key)
          }
        }
      }
    }
    steps++
    possibles = next
    if (steps % grid.width == 65) {
      sampleCounts.push(possibles.length)
      console.log(
        [sampleCounts.length, '/', sampleCountTarget].join(''),
        'samples'
      )
    }
  } while (sampleCounts.length < sampleCountTarget)

  // Copted from day 9!
  let current = sampleCounts
  let seqs = [current]
  do {
    let next = []
    for (let i = 1; i < current.length; i++) {
      next.push(current[i] - current[i - 1])
    }
    seqs.push(next)
    current = next
  } while (!current.every((diff) => diff == 0))

  let iterations = Math.ceil(26501365 / 131)
  while (seqs[0].length != iterations) {
    for (let i = seqs.length - 2; i >= 0; i--) {
      seqs[i].push(seqs[i].at(-1) + seqs[i + 1].at(-1))
    }
  }

  return seqs[0].at(-1)
}

console.log('Part 1')
console.log('answer:', part1())
console.log()

console.log('Part 2')
if (process.argv[2] == 'test') {
  console.log('only applicable to the real input')
  process.exit()
}
console.log('answer:', part2())
