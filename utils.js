const crypto = require('crypto')

/**
 * @param {string[][]} cols
 * @return {string[][]}
 */
function colsToRows(cols) {
  return Array.from(new Array(cols[0].length), (_, rowIndex) =>
    cols.map((col) => col[rowIndex])
  )
}

/**
 * Create a grid from an input string in the format:
 *
 * 123
 * 456
 * 789
 *
 * @param {string} input
 * @returns {{
 *   cols: string[][]
 *   colStrings: string[]
 *   rows: string[][]
 *   rowStrings: string[]
 *   grid: string[][] & {width: number, height: number, print: () => void, hash() => string}
 * }}
 */
exports.getGrid = function getGrid(input) {
  let rowStrings = input.split('\n')
  let rows = rowStrings.map((rowString) => rowString.split(''))
  let cols = Array.from(new Array(rowStrings[0].length), (_, colIndex) =>
    rowStrings.map((row) => row.charAt(colIndex))
  )
  let grid = Object.assign(
    cols.map((col) => col.slice()),
    {
      height: rows.length,
      width: cols.length,
      /**
       * @this {string[][]}
       */
      hash() {
        return crypto
          .createHash('sha1')
          .update(this.map((col) => col.join('')).join(''))
          .digest('base64')
      },
      /**
       * @this {string[][]}
       */
      print() {
        colsToRows(this).forEach((row) => console.log(row.join('')))
      },
    }
  )
  let colStrings = cols.map((col) => col.join(''))
  return {rows, cols, rowStrings, colStrings, grid}
}

exports.range = function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    stop = start
    start = 0
  }
  if (typeof step == 'undefined') {
    step = 1
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []
  }

  let result = []
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }
  return result
}
