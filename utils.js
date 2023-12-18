const crypto = require('crypto')

/**
 * @param {string} data
 */
function hash(data) {
  return crypto.createHash('sha1').update(data).digest('base64')
}

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
function getGrid(input) {
  let cols = rotate(input.split('\n').map((row) => row.split('')))
  let width = cols.length
  let height = cols[0].length
  return Object.assign(cols, {
    get height() {
      return height
    },
    get width() {
      return width
    },
    /**
     * @param {[number, number]} pos
     */
    at([x, y]) {
      return cols[x][y]
    },
    /**
     * @param {[number, number]} pos
     */
    contains([x, y]) {
      return x >= 0 && x < width && y >= 0 && y < height
    },
    /**
     * @param {[number, number]} pos
     */
    outside(pos) {
      return !this.contains(pos)
    },
    hash() {
      return hash(cols.map((col) => col.join('')).join(''))
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
function range(startOrStop, stop, step = 1) {
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
function sum(nums) {
  return nums.reduce((acc, num) => acc + num, 0)
}

module.exports = {
  getGrid,
  hash,
  range,
  rotate,
  sum,
}
