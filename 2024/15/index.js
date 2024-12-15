const fs = require('fs')
const {add, dirs, oppositeDirs, getGrid, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)
let debug = process.argv[2] != null

let [mapInput, movesInput] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
let map = getGrid(mapInput)
let moves = movesInput.split('\n').join('').split('')

console.log('Part 1')
let botPos = map.findItem('@')
for (let dir of moves) {
  let delta = dirs[dir]
  let nextBotPos = add(botPos, delta)
  if (map.get(nextBotPos) == '.') {
    map.set('.', botPos)
    map.set('@', nextBotPos)
    botPos = nextBotPos
  } else if (map.get(nextBotPos) == 'O') {
    let boxesToMove = 1
    let lastBoxPos = add(nextBotPos, delta)
    while (map.get(lastBoxPos) == 'O') {
      boxesToMove++
      lastBoxPos = add(lastBoxPos, delta)
    }
    if (map.get(lastBoxPos) == '.') {
      map.set('.', botPos)
      map.set('@', nextBotPos)
      let boxPos = add(nextBotPos, delta)
      for (let i = 1; i <= boxesToMove; i++) {
        map.set('O', boxPos)
        boxPos = add(boxPos, delta)
      }
      botPos = nextBotPos
    }
  }
}
if (debug) map.print()
console.log(
  'answer:',
  sum(
    Array.from(map)
      .filter(({value}) => value == 'O')
      .map(({pos}) => 100 * pos[1] + pos[0])
  )
)
console.log()

console.log('Part 2')
mapInput = mapInput
  .replaceAll('#', '##')
  .replaceAll('O', '[]')
  .replaceAll('.', '..')
  .replaceAll('@', '@.')
map = getGrid(mapInput)
botPos = map.findItem('@')
let boxChars = new Set(['[', ']'])
/**
 * Given the position of one half of a box, returns the positions of both parts
 * of the box.
 * @param {[number, number]} pos
 * @returns {[[number, number], [number, number]]}
 */
function expandBox(pos) {
  if (map.get(pos) == ']') {
    return [add(pos, dirs['<']), pos]
  } else {
    return [pos, add(pos, dirs['>'])]
  }
}
for (let dir of moves) {
  let delta = dirs[dir]
  let nextBotPos = add(botPos, delta)
  if (map.get(nextBotPos) == '.') {
    map.set('@', nextBotPos)
    map.set('.', botPos)
    botPos = nextBotPos
  } else if (boxChars.has(map.get(nextBotPos))) {
    // Horizontal, same as before but check for all box parts and copy
    if (dir == '>' || dir == '<') {
      let boxesToMove = 1
      let lastBoxPos = add(nextBotPos, delta)
      while (boxChars.has(map.get(lastBoxPos))) {
        boxesToMove++
        lastBoxPos = add(lastBoxPos, delta)
      }
      if (map.get(lastBoxPos) == '.') {
        let oppositeDelta = dirs[oppositeDirs[dir]]
        for (let i = 1; i <= boxesToMove; i++) {
          map.set(map.get(lastBoxPos, oppositeDelta), lastBoxPos)
          lastBoxPos = add(lastBoxPos, oppositeDelta)
        }
        map.set('@', nextBotPos)
        map.set('.', botPos)
        botPos = nextBotPos
      }
    }
    // Vertical, check all spaces above/below boxes which are moving
    else {
      let move = false
      let boxesToMove = [[expandBox(nextBotPos)]]
      let currentBoxes = [expandBox(nextBotPos)]
      while (true) {
        // If any boxes are moving towards a #, don't move
        if (
          currentBoxes.some(
            ([boxL, boxR]) =>
              map.get(boxL, delta) == '#' || map.get(boxR, delta) == '#'
          )
        ) {
          break
        }
        // If all boxes are moving towards a ., move
        if (
          currentBoxes.every(
            ([boxL, boxR]) =>
              map.get(boxL, delta) == '.' && map.get(boxR, delta) == '.'
          )
        ) {
          move = true
          break
        }
        // Find all boxes being touched by the current layer of moving boxes
        /** @type {[[number, number], [number, number]][]} */
        let nextBoxes = []
        for (let [boxL, boxR] of currentBoxes) {
          if (map.get(boxL, delta) == '[') {
            nextBoxes.push([add(boxL, delta), add(boxR, delta)])
          } else if (map.get(boxL, delta) == ']') {
            nextBoxes.push(expandBox(add(boxL, delta)))
          }
          if (map.get(boxR, delta) == '[') {
            nextBoxes.push(expandBox(add(boxR, delta)))
          }
        }
        boxesToMove.push(nextBoxes)
        currentBoxes = nextBoxes
      }
      if (move) {
        for (let boxes of boxesToMove.toReversed()) {
          for (let [boxL, boxR] of boxes) {
            map.set('[', boxL, delta)
            map.set(']', boxR, delta)
            map.set('.', boxL)
            map.set('.', boxR)
          }
        }
        map.set('@', nextBotPos)
        map.set('.', botPos)
        botPos = nextBotPos
      }
    }
  }
}
if (debug) map.print()
console.log(
  'answer:',
  sum(
    Array.from(map)
      .filter(({value}) => value == '[')
      .map(({pos}) => 100 * pos[1] + pos[0])
  )
)
