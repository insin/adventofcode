const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 *   id: number
 *   rounds: Map<string, number>[]
 *   minimums: Map<string, number>
 * }} Game
 */

/**
 * @param {string} input
 * @returns {Game[]}
 */
function parseGames(input) {
  return input.split('\n').map((line) => {
    let [gameId, rounds] = line.split(': ')
    /** @type {Map<string, number>} */
    let minimums = new Map(Object.entries({red: 0, green: 0, blue: 0}))
    return {
      id: Number(gameId.match(/\d+/)[0]),
      rounds: rounds.split('; ').map((round) => {
        /** @type {Map<string, number>} */
        let balls = new Map(Object.entries({red: 0, green: 0, blue: 0}))
        round.split(', ').forEach((ball) => {
          let [count, colour] = ball.split(' ')
          balls.set(colour, Number(count))
          if (balls.get(colour) > minimums.get(colour)) {
            minimums.set(colour, balls.get(colour))
          }
        })
        return balls
      }),
      minimums,
    }
  })
}

let debug = process.argv[2] != null
let games = parseGames(inputs.at(process.argv[2] == 'test' ? 0 : -1))
let possibleGames = games.filter((game) =>
  game.rounds.every(
    (balls) =>
      balls.get('red') <= 12 &&
      balls.get('green') <= 13 &&
      balls.get('blue') <= 14
  )
)

console.log('Part 1')
if (debug) {
  console.log('possible games:', possibleGames.map(({id}) => id).join(', '))
}
let answer = possibleGames.reduce((acc, game) => acc + game.id, 0)
console.log('answer:', answer)
console.log()

console.log('Part 2')
if (debug) {
  console.log('minimums:')
  games.map((game) => console.log(game.minimums))
}
answer = games.reduce(
  (acc, {minimums}) =>
    acc + minimums.get('red') * minimums.get('green') * minimums.get('blue'),
  0
)
console.log('answer:', answer)
