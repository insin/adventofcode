const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 *   line: number
 *   startIndex: number
 *   endIndex: number
 *   value: number
 * }} SchematicNumber
 */

/**
 * @typedef {{
 *  line: number
 *  index: number
 *  value: string
 * }} SchematicSymbol
 */

let debug = process.argv[2] != null
/** @type {SchematicNumber[]} */
let numbers = []
/** @type {SchematicSymbol[]} */
let symbols = []
let schematicRegExp = /(?<number>\d+)|(?<symbol>[^.])/g

for (let [index, line] of inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .entries()) {
  for (let match of line.matchAll(schematicRegExp)) {
    if (match.groups.number) {
      numbers.push({
        line: index,
        startIndex: match.index,
        endIndex: match.index + match.groups.number.length - 1,
        value: Number(match.groups.number),
      })
    } else if (match.groups.symbol) {
      symbols.push({
        line: index,
        index: match.index,
        value: match.groups.symbol,
      })
    }
  }
}

/**
 * @param {SchematicNumber} number
 * @param {SchematicSymbol} symbol
 * @returns {boolean}
 */
function adjacent(number, symbol) {
  return (
    ((symbol.line == number.line - 1 || symbol.line == number.line + 1) &&
      symbol.index >= number.startIndex - 1 &&
      symbol.index <= number.endIndex + 1) ||
    (symbol.line == number.line &&
      (symbol.index == number.startIndex - 1 ||
        symbol.index == number.endIndex + 1))
  )
}

console.log('Part 1')
let includedNumbers = numbers.filter((number) =>
  symbols.some((symbol) => adjacent(number, symbol))
)
if (debug) {
  let excludedNumbers = numbers.filter(
    (number) => !includedNumbers.includes(number)
  )
  console.log('excluded numbers:', excludedNumbers)
}
let answer = includedNumbers.reduce((acc, {value}) => acc + value, 0)
console.log('answer:', answer)
console.log()

console.log('Part 2')
answer = symbols.reduce((acc, symbol) => {
  if (symbol.value == '*') {
    let adjacentNumbers = numbers.filter((number) => adjacent(number, symbol))
    if (adjacentNumbers.length == 2) {
      if (debug) {
        console.log({gear: symbol, numbers: adjacentNumbers})
      }
      return acc + adjacentNumbers[0].value * adjacentNumbers[1].value
    }
  }
  return acc
}, 0)
console.log('answer:', answer)
