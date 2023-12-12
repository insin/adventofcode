/**
 * I didn't have a clue how to get started today, other than potentially brute
 * forcing part 1 using combinations to generate every possible solution then
 * checking the non-? parts of each row against them.
 *
 * Instead, I used the following solution as a basis for learning how to solve
 * this type of problem using Dynamic Programming (i.e. break the problem down
 * into successively smaller problems using a recursive function and a cache):
 *
 * https://github.com/fuglede/adventofcode/blob/master/2023/day12/solutions.py
 *
 * To prove to myself that I understood the solution, I didn't replicate its
 * trick of appending a '.' to the end of every row, and instead made the
 * necessary code changes to handle the resulting scenario.
 */

const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

/**
 * @typedef {[string, number[]]} Line
 */

/** @type {Line[]} */
let lines = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [row, sizes] = line.split(' ')
    return [row, sizes.split(',').map(Number)]
  })

let cache = new Map()

/**
 * @param {string} row
 * @param {number[]} sizes
 * @param {number} numberInCurrentGroup
 * @returns {number}
 */
function countSolutions(row, sizes, numberInCurrentGroup = 0) {
  let key = [row, sizes.join(','), numberInCurrentGroup].join('|')
  if (cache.has(key)) return cache.get(key)

  // Once all characters have been consumed, check if all groups are finished
  if (row == '') {
    let valid =
      // All groups were finished before the last character
      (sizes.length == 0 && numberInCurrentGroup == 0) ||
      // The last character finished the remaining group
      (sizes.length == 1 && numberInCurrentGroup == sizes[0])
    cache.set(key, valid ? 1 : 0)
    return cache.get(key)
  }

  let count = 0
  // Every time we hit a ?, try # or . in its place instead
  let next = row.charAt(0) == '?' ? ['#', '.'] : [row.charAt(0)]
  for (let char of next) {
    if (char == '#') {
      // Start a new group or extend the current group
      count += countSolutions(row.slice(1), sizes, numberInCurrentGroup + 1)
    } else {
      // If we're currently in a group
      if (numberInCurrentGroup > 0) {
        // Finish the group if we've reached its size
        if (sizes.length > 0 && sizes[0] == numberInCurrentGroup) {
          count += countSolutions(row.slice(1), sizes.slice(1))
        }
        // Otherwise, the solution we were checking is invalid - no more
        // characters will be checked, as we fall through to return, without
        // having added anything to the valid count.
      } else {
        // Move on to the next character
        count += countSolutions(row.slice(1), sizes)
      }
    }
  }
  cache.set(key, count)
  return count
}

console.log('Part 1')
if (debug) {
  for (let [row, sizes] of lines) {
    let count = countSolutions(row, sizes)
    console.log(`${row} - ${count} arrangement${count != 1 ? 's' : ''}`)
  }
}
console.log(
  'answer:',
  lines.reduce((acc, [row, sizes]) => acc + countSolutions(row, sizes), 0)
)
console.log()

/**
 * @param {Line} line
 * @returns {Line}
 */
function expand([row, sizes]) {
  return [new Array(5).fill(row).join('?'), new Array(5).fill(sizes).flat()]
}

console.log('Part 2')
if (debug) {
  for (let line of lines) {
    let [row, sizes] = expand(line)
    let count = countSolutions(row, sizes)
    console.log(`${line[0]} - ${count} arrangement${count != 1 ? 's' : ''}`)
  }
}
console.log(
  'answer:',
  lines.reduce((acc, line) => acc + countSolutions(...expand(line)), 0)
)
