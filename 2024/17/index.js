const fs = require('fs')
const {nums} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let [A, B, C, ...program] = nums(inputs.at(process.argv[2] == 'test' ? 0 : -1))

function run() {
  let output = []
  let pointer = 0
  let opcode
  let operand

  function combo() {
    if (operand < 4) return operand
    if (operand == 4) return A
    if (operand == 5) return B
    if (operand == 6) return B
    throw new Error('invalid combo operand: ' + operand)
  }

  while (pointer < program.length) {
    opcode = program[pointer]
    operand = program[pointer + 1]
    switch (opcode) {
      // adv
      case 0:
        A = Math.floor(A / 2 ** combo())
        break
      // bxl
      case 1:
        B = B ^ operand
        break
      // bst
      case 2:
        B = combo() % 8
        break
      // jnz
      case 3:
        if (A != 0) {
          pointer = operand - 2
        }
        break
      // bxc
      case 4:
        B = B ^ C
        break
      // out
      case 5:
        output.push(combo() % 8)
        break
      // bdv
      case 6:
        B = Math.floor(A / 2 ** combo())
        break
      // cdv
      case 7:
        C = Math.floor(A / 2 ** combo())
        break
    }
    pointer += 2
  }
  return output.join(',')
}

console.log('Part 1')
console.log('answer:', run())
console.log()

console.log('Part 2')
console.log('answer:')
