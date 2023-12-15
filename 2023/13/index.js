const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 *   before: number
 *   left: number
 *   right: number
 * }} Reflection
 */

let debug = process.argv[2] != null

function print(grid) {
  console.log(grid.join('\n'))
  console.log()
}

let patterns = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
  .map((pattern) => {
    let rows = pattern.split('\n')
    let columns = Array.from(Array(rows[0].length), (_, colIndex) =>
      rows.map((row) => row.charAt(colIndex)).join('')
    )
    return [rows, columns]
  })

/**
 * @param {string[]} grid
 * @param {Reflection} [previous]
 * @returns {Reflection}
 */
function getReflection(grid, previous) {
  for (let index of grid.keys()) {
    if (grid[index] == grid[index + 1]) {
      let left = index
      let right = index + 1
      // Reflect if subsequent pairs either side match until the we hit an edge
      while (
        left > 0 &&
        right < grid.length - 1 &&
        grid[left - 1] == grid[right + 1]
      ) {
        left--
        right++
      }
      let isReflection = left == 0 || right == grid.length - 1
      let matchesExisting = previous
        ? previous.left == left && previous.right == right
        : false
      if (isReflection && !matchesExisting) {
        return {before: index + 1, left, right}
      }
    }
  }
  return null
}

console.log('Part 1')
let answer = 0
for (let [rows, cols] of patterns) {
  let colR = getReflection(cols)
  let rowR = getReflection(rows)
  if (debug) {
    print(rows)
    if (colR) console.log('lines to left:', colR.before)
    if (rowR) console.log('lines above:', rowR.before)
    console.log()
  }
  answer += colR?.before ?? 0
  answer += (rowR?.before ?? 0) * 100
}
console.log('answer:', answer)
console.log()

console.log('Part 2')
answer = 0
patternLoop: for (let [rows, cols] of patterns) {
  let colR = getReflection(cols)
  let rowR = getReflection(rows)
  for (let x = 0; x < cols.length; x++) {
    for (let y = 0; y < rows.length; y++) {
      let smudgeRows = rows.slice()
      let row = smudgeRows[y].split('')
      row[x] = row[x] == '.' ? '#' : '.'
      smudgeRows[y] = row.join('')

      let smudgeCols = cols.slice()
      let col = smudgeCols[x].split('')
      col[y] = col[y] == '.' ? '#' : '.'
      smudgeCols[x] = col.join('')

      let newColR = getReflection(smudgeCols, colR)
      let newRowR = getReflection(smudgeRows, rowR)
      if (newColR || newRowR) {
        if (debug) {
          console.log({x, y})
          if (newColR) console.log('new lines to left:', newColR.before)
          if (newRowR) console.log('new lines above:', newRowR.before)
          print(smudgeRows)
        }
        if (newColR) answer += newColR.before
        if (newRowR) answer += newRowR.before * 100
        continue patternLoop
      }
    }
  }
}
console.log('answer:', answer)
