const fs = require('fs')
// const {add, getGrid, range, Range, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 * }} Name
 */

let debug = process.argv[2] != null

let things = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line, index) => {})

console.log('Part 1')
console.log('answer:')
console.log()

console.log('Part 2')
console.log('answer:')
