const fs = require('fs')
const {getGrid, range} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let input = inputs.at(process.argv[2] == 'test' ? 0 : -1)
let grid = getGrid(input)

/**
 * @typedef {{
 *   x: number
 *   y: number
 *   dir: '>' | '<' | '^' |'v'
 * }} Beam
 */

let nextMove = {
  '>': {dx: 1},
  '<': {dx: -1},
  '^': {dy: -1},
  v: {dy: 1},
}

let nextDir = {
  '.': (dir) => dir,
  '-': (dir) => (dir == '>' || dir == '<' ? [dir] : ['<', '>']),
  '|': (dir) => (dir == '^' || dir == 'v' ? [dir] : ['^', 'v']),
  '\\': (dir) => {
    switch (dir) {
      case '>':
        return ['v']
      case '<':
        return ['^']
      case '^':
        return ['<']
      case 'v':
        return ['>']
    }
  },
  '/': (dir) => {
    switch (dir) {
      case '>':
        return ['^']
      case '<':
        return ['v']
      case '^':
        return ['>']
      case 'v':
        return ['<']
    }
  },
}

function outside(x, y) {
  return x < 0 || x == grid.width || y < 0 || y == grid.height
}

/**
 * @param {Beam[]} beams
 * @returns {number}
 */
function bounce(beams, printEnergy = false) {
  let energy = getGrid(input.replaceAll(/[^\n]/g, '.'))
  let seen = new Set()
  while (beams.length) {
    let removeBeams = []
    let addBeams = []
    for (let beam of beams) {
      if (!outside(beam.x, beam.y)) {
        energy[beam.x][beam.y] = '#'
      }
      let {dx = 0, dy = 0} = nextMove[beam.dir]
      let x = beam.x + dx
      let y = beam.y + dy
      let key = `${x},${y},${beam.dir}}`
      // Remove beam if it exits or we've already seen the same x, y and dir
      if (outside(x, y) || seen.has(key)) {
        removeBeams.push(beam)
      } else {
        seen.add(key)
        beam.x = x
        beam.y = y
        let dirs = nextDir[grid[x][y]](beam.dir)
        beam.dir = dirs[0]
        // Split beam
        if (dirs.length > 1) {
          addBeams.push({...beam, dir: dirs[1]})
        }
      }
    }
    removeBeams.forEach((beam) => beams.splice(beams.indexOf(beam), 1))
    addBeams.forEach((beam) => beams.push(beam))
  }
  if (printEnergy) {
    energy.print()
  }
  return energy.flat().filter((item) => item == '#').length
}

console.log('Part 1')
console.log('answer:', bounce([{x: -1, y: 0, dir: '>'}], debug))
console.log()

console.log('Part 2')
console.log(
  'answer:',
  Math.max(
    ...[
      range(grid.height).map((y) => ({x: -1, y, dir: '>'})),
      range(grid.height).map((y) => ({x: grid.width, y, dir: '<'})),
      range(grid.width).map((x) => ({x, y: -1, dir: 'v'})),
      range(grid.width).map((x) => ({x, y: grid.height, dir: '^'})),
    ]
      .flat()
      .map((beam) => bounce([beam]))
  )
)
