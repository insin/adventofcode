const fs = require('fs')
const {rotate, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

/** @type {{dir: string, length: number, color: string}[]} */
let plans = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => {
    let [dir, length, color] = line.split(' ')
    return {dir, length: Number(length), color: color.substring(2, 8)}
  })

// Determine the dimensions of the grid after following the plans, and the
// starting point.
function getDimensions(plans) {
  let maxX = 0
  let minX = 0
  let maxY = 0
  let minY = 0
  let x = 0
  let y = 0
  for (let {dir, length} of plans) {
    switch (dir) {
      case 'U':
        y -= length
        break
      case 'D':
        y += length
        break
      case 'R':
        x += length
        break
      case 'L':
        x -= length
        break
    }
    if (x > maxX) maxX = x
    if (x < minX) minX = x
    if (y > maxY) maxY = y
    if (y < minY) minY = y
  }

  let width = maxX - minX + 1
  let height = maxY - minY + 1
  let start = [Math.abs(minX), Math.abs(minY)]
  return {width, height, start}
}

// Dig the trench using the same figures as day 10's puzzle so we can reuse its
// area calculation.
function digTrench(plans, {width, height, start}) {
  let grid = Array.from(Array(width), () =>
    Array.from(Array(height), () => '.')
  )

  let x = start[0]
  let y = start[1]
  let prevDir = plans.at(-1).dir
  for (let {dir, length} of plans) {
    switch (dir) {
      case 'U':
        grid[x][y] = {U: '|', D: '|', L: 'L', R: 'J'}[prevDir]
        for (let i = 0; i < length - 1; i++) {
          grid[x][--y] = '|'
        }
        y--
        break
      case 'D':
        grid[x][y] = {U: '|', D: '|', L: 'F', R: '7'}[prevDir]
        for (let i = 0; i < length - 1; i++) {
          grid[x][++y] = '|'
        }
        y++
        break
      case 'R':
        grid[x][y] = {U: 'F', D: 'L', L: '-', R: '-'}[prevDir]
        for (let i = 0; i < length - 1; i++) {
          grid[++x][y] = '-'
        }
        x++
        break
      case 'L':
        grid[x][y] = {U: '7', D: 'J', L: '-', R: '-'}[prevDir]
        for (let i = 0; i < length - 1; i++) {
          grid[--x][y] = '-'
        }
        x--
        break
    }
    prevDir = dir
  }

  return grid
}

function printGrid(grid) {
  rotate(grid).forEach((row) => console.log(row.join('')))
  console.log()
}

// Reused from Day 10
function getGridArea(grid) {
  let area = 0
  for (let [y, row] of rotate(grid).entries()) {
    let counting = false
    for (let [x, item] of row.entries()) {
      if (item != '.') {
        area++
        let goingUpOrDown = /(\||L-*7|F-*J)$/.test(row.slice(0, x + 1).join(''))
        if (goingUpOrDown) {
          counting = !counting
        }
      } else if (counting) {
        area++
        grid[x][y] = 'I'
      }
    }
  }
  return area
}

console.log('Part 1')
let dimensions = getDimensions(plans)
if (debug) {
  console.log(dimensions)
}
let grid = digTrench(plans, dimensions)
if (debug) {
  printGrid(grid)
}
let area = getGridArea(grid)
if (debug) {
  printGrid(grid)
}
console.log('answer:', area)
console.log()

console.log('Part 2')

let realPlans = plans.map(({color}) => {
  let hex = color.split('')
  let dir = {0: 'R', 1: 'D', 2: 'L', 3: 'U'}[hex.pop()]
  return {dir, length: parseInt(hex.join(''), 16)}
})

function getPoints(plans) {
  let x = 0
  let y = 0
  let points = []
  for (let {dir, length} of plans) {
    switch (dir) {
      case 'U':
        y -= length
        break
      case 'D':
        y += length
        break
      case 'R':
        x += length
        break
      case 'L':
        x -= length
        break
    }
    points.push([x, y])
  }
  return points
}

// Shoelace formula
function getArea(points) {
  let total = 0
  for (let i = 0; i < points.length; i++) {
    let addX = points[i][0]
    let addY = points[i === points.length - 1 ? 0 : i + 1][1]
    let subX = points[i === points.length - 1 ? 0 : i + 1][0]
    let subY = points[i][1]
    total += addX * addY * 0.5 - subX * subY * 0.5
  }
  return Math.abs(total)
}

let points = getPoints(realPlans)
let realArea = getArea(points)
// TIL this is Pick's formula - I brute-forced it based on the delta from the
// example answer.
let perimeter = sum(realPlans.map((plan) => plan.length)) / 2 + 1
console.log('answer:', realArea + perimeter)
