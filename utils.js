const crypto = require('crypto')
const util = require('util')

function diff(list) {
  let result = []
  for (let i = 1; i < list.length; i++) {
    result.push(list[i] - list[i - 1])
  }
  return result
}
/** @type {Record<string, [number, number]>} */
const dirs = {
  ['^']: [0, -1],
  ['>']: [1, 0],
  ['v']: [0, 1],
  ['<']: [-1, 0],
}

const oppositeDirs = {
  ['^']: 'v',
  ['>']: '<',
  ['v']: '^',
  ['<']: '>',
}

/**
 * @param {[number, number]} pos
 * @param {[number, number]} delta
 * @returns {[number, number]}
 */
function add(pos, delta) {
  return [pos[0] + delta[0], pos[1] + delta[1]]
}

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
     * @param {string} item
     * @returns {[number, number]}
     */
    findItem(item) {
      for (let [x, row] of cols.entries()) {
        let y = row.indexOf(item)
        if (y != -1) return [x, y]
      }
      return null
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
 * @param {string} line
 */
function nums(line) {
  return Array.from(line.matchAll(/\d+/g), Number)
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

class Range {
  /**
   * @param {number} start
   * @param {number} end
   */
  constructor(start, end) {
    this.start = start
    this.end = end
  }

  get length() {
    return this.end - this.start + 1
  }

  /**
   * @param {number} delta
   */
  add(delta) {
    this.start += delta
    this.end += delta
  }

  clone() {
    return new Range(this.start, this.end)
  }

  /**
   * @param {number} num
   * @returns {boolean}
   */
  includes(num) {
    return num >= this.start && num <= this.end
  }

  /**
   * @param {Range} range
   * @returns {Range | null}
   */
  intersection(range) {
    if (this.start <= range.end && this.end >= range.start) {
      return new Range(
        Math.max(this.start, range.start),
        Math.min(this.end, range.end)
      )
    }
    return null
  }

  toString() {
    return `${this.start}..${this.end}`
  }

  [util.inspect.custom]() {
    return this.toString()
  }
}

/**
 * @param {number[]} nums
 */
function sum(nums) {
  return nums.reduce((acc, num) => acc + num, 0)
}

function uniquePairs(list) {
  if (list.length < 2) return []
  let head = list[0]
  let tail = list.slice(1)
  let pairs = tail.map((item) => [head, item])
  return pairs.concat(uniquePairs(tail))
}

module.exports = {
  Range,
  add,
  diff,
  dirs,
  getGrid,
  hash,
  nums,
  oppositeDirs,
  range,
  rotate,
  sum,
  uniquePairs,
}
