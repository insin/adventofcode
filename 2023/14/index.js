const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let rows = inputs.at(process.argv[2] == 'test' ? 0 : -1).split('\n')
let columns = Array.from(new Array(rows[0].length), (_, colIndex) =>
  rows.map((row) => row.charAt(colIndex))
)

function printColumns() {
  for (let row of Array.from(new Array(columns[0].length), (_, rowIndex) =>
    columns.map((col) => col[rowIndex])
  )) {
    console.log(row.join(''))
  }
}

console.log('Part 1')

for (let column of columns) {
  let free = null
  for (let [index, item] of column.entries()) {
    switch (item) {
      case '.': {
        if (free == null) {
          free = index
        }
        break
      }
      case '#': {
        free = null
        break
      }
      case 'O': {
        if (free != null) {
          column[free] = 'O'
          column[index] = '.'
          if (column[free + 1] == '.') {
            free++
          } else {
            free = null
          }
        }
        break
      }
    }
  }
}
printColumns()
let answer = columns.reduce(
  (acc1, col) =>
    acc1 +
    col.reduce(
      (acc2, item, index) => acc2 + (item == 'O' ? col.length - index : 0),
      0
    ),
  0
)
console.log('answer:', answer)
console.log()

console.log('Part 2')
console.log('answer:', answer)
