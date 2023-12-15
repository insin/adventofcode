const crypto = require('crypto')

/**
 * @param {string[][]} grid
 */
function rotate(grid) {
  return Array.from(Array(grid[0].length), (_, index) =>
    grid.map((items) => items[index])
  )
}

/**
 * Create a grid from a string in the format:
 *
 * 123
 * 456
 * 789
 *
 * @param {string} input
 */
exports.getGrid = function getGrid(input) {
  let cols = rotate(input.split('\n').map((row) => row.split('')))
  return Object.assign(cols, {
    get height() {
      return cols[0].length
    },
    get width() {
      return cols.length
    },
    hash() {
      return crypto
        .createHash('sha1')
        .update(cols.map((col) => col.join('')).join(''))
        .digest('base64')
    },
    print() {
      rotate(cols).forEach((row) => console.log(row.join('')))
    },
  })
}

/**
 * @param {number} startOrStop
 * @param {number} [stop]
 */
exports.range = function range(startOrStop, stop, step = 1) {
  if (step == 0) {
    throw new Error('range() step argument must not be 0')
  }

  let start = startOrStop
  if (typeof stop == 'undefined') {
    stop = start
    start = 0
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []
  }

  let result = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }
  return result
}

/**
 * @param {number[]} nums
 */
exports.sum = function sum(nums) {
  return nums.reduce((acc, num) => acc + num, 0)
}
