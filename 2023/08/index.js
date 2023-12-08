const fs = require('fs')
let inputs = ['example1', 'example2', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let [instructionsLine, nodeLines] = inputs
  .at(process.argv[2] == 'test' ? 1 : -1)
  .split('\n\n')
let instructions = instructionsLine.split('')
let nodes = new Map()
for (let line of nodeLines.split('\n')) {
  let [node, L, R] = line.match(/(\w+)/g)
  nodes.set(node, {L, R})
}

/**
 * @param {string} node
 * @param {(node) => boolean} finished
 * @returns {number}
 */
function countSteps(node, finished) {
  let steps = 0
  while (!finished(node)) {
    node = nodes.get(node)[instructions[steps % instructions.length]]
    steps++
  }
  return steps
}

console.log('Part 1')
console.log(
  'answer:',
  countSteps('AAA', (node) => node === 'ZZZ')
)
console.log()

console.log('Part 2')
let stepCounts = Array.from(nodes.keys())
  .filter((key) => key.endsWith('A'))
  .map((node) => countSteps(node, (node) => node.endsWith('Z')))
let lcm = require('compute-lcm')
console.log('answer:', lcm(stepCounts))
