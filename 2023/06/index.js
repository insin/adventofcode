const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let [timeLine, distanceLine] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
let times = timeLine.match(/\d+/g).map(Number)
let distances = distanceLine.match(/\d+/g).map(Number)

function race(time, distanceToBeat) {
  let wins = 0
  for (let i = 0; i <= time; i++) {
    let holdTime = i
    let speed = i
    let raceTime = time - holdTime
    let distance = speed * raceTime
    if (debug) {
      console.log(
        `Hold for ${holdTime}ms. speed ${speed}mm/ms for ${raceTime}ms, distance ${distance}mm`
      )
    }
    if (distance > distanceToBeat) {
      wins++
    }
  }
  return wins
}

console.log('Part 1')
let waysToWin = times.map((time, raceIndex) => race(time, distances[raceIndex]))
if (debug) {
  console.log('ways to win', waysToWin)
}
let answer = waysToWin.reduce((acc, num) => acc * num, 1)
console.log('answer:', answer)
console.log()

console.log('Part 2')
answer = race(Number(times.join('')), Number(distances.join('')))
console.log('answer:', answer)
