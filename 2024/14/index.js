const fs = require('fs')
const {add, getGrid} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

/** @type {{p: [number, number], v: [number, number]}[]} */
let robots = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [p, v] = line
      .split(' ')
      .map((part) => part.split('=')[1].split(',').map(Number))
    return {p, v}
  })

console.log('Part 1')
let width = process.argv[2] == 'test' ? 11 : 101
let height = process.argv[2] == 'test' ? 7 : 103

function print() {
  let gridInput = ''
  for (let h = 0; h < height; h++) {
    gridInput += '.'.repeat(width) + '\n'
  }
  let grid = getGrid(gridInput)
  for (let robot of robots) {
    if (grid.get(robot.p) == '.') {
      grid.set(1, robot.p)
    } else {
      grid.set(grid.get(robot.p) + 1, robot.p)
    }
  }
  grid.print()
}

/**
 * @param {[number, number]} pos
 * @returns {[number, number]}
 */
function teleport([x, y]) {
  if (x < 0) x = width + x
  else if (x >= width) x = x - width
  if (y < 0) y = height + y
  else if (y >= height) y = y - height
  return [x, y]
}

for (let seconds = 1; seconds <= 100; seconds++) {
  for (let i = 0; i < robots.length; i++) {
    let {p, v} = robots[i]
    robots[i].p = teleport(add(p, v))
  }
}

if (debug) print()

let xMid = Math.floor(width / 2)
let yMid = Math.floor(height / 2)
let quadrants = [0, 0, 0, 0]
for (let {p} of robots) {
  if (p[0] < xMid) {
    if (p[1] < yMid) quadrants[0]++
    if (p[1] > yMid) quadrants[2]++
  }
  if (p[0] > xMid) {
    if (p[1] < yMid) quadrants[1]++
    if (p[1] > yMid) quadrants[3]++
  }
}
console.log(
  'answer:',
  quadrants.reduce((acc, n) => acc * n)
)

/*
For Part 2:
- increase the number of seconds
- print() after moving the robots each second
- node index.js > out.txt
- enable the minimap in VS Code and scroll through out.txt
*/
