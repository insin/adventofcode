const fs = require('fs')
const lcm = require('compute-lcm')
const {sum} = require('../../utils')
let inputs = ['example1', 'example2', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{from: string, to: string, pulse: 'high' | 'low'}} Message
 *
 * @typedef {{
 *   type: 'broadcaster'
 *   name: 'broadcaster'
 *   outputs: string[]
 * }} Broadcaster
 *
 * @typedef {{
 *   type: '%'
 *   name: string
 *   inputs: string[]
 *   outputs: string[]
 *   state: 'on' | 'off'
 * }} FlipFlop
 *
 * @typedef {{
 *   type: '&'
 *   name: string
 *   inputs: string[]
 *   outputs: string[]
 *   state: Map<string, 'high' | 'low'>
 * }} Conjunction
 */

let debug = process.argv[2] != null

const FLIP_FLOP = '%'
const CONJUNCTION = '&'

/** @type {Map<string, Broadcaster | Conjunction | FlipFlop>} */
let modules

function resetModules() {
  modules = new Map(
    inputs
      .at(process.argv[2] == 'test' ? 1 : -1)
      .split('\n')
      .map((line) => {
        let [name, outputs] = line.split(' -> ')
        if (name == 'broadcaster') {
          return [
            name,
            {
              type: 'broadcaster',
              name: 'broadcaster',
              outputs: outputs.split(', '),
            },
          ]
        } else if (name.charAt(0) == FLIP_FLOP) {
          return [
            name.substring(1),
            {
              type: '%',
              name: name.substring(1),
              inputs: [],
              outputs: outputs.split(', '),
              state: 'off',
            },
          ]
        } else if (name.charAt(0) == CONJUNCTION) {
          return [
            name.substring(1),
            {
              type: '&',
              name: name.substring(1),
              inputs: [],
              outputs: outputs.split(', '),
              state: new Map(),
            },
          ]
        }
      })
  )

  // Connect modules to their inputs and initialise conjunction state
  modules.forEach((module) => {
    if (module.type == FLIP_FLOP || module.type == CONJUNCTION) {
      // prettier-ignore
      module.inputs = [...modules.values()].filter((from) =>
        from.name != module.name && from.outputs.includes(module.name)
      ).map((from) => from.name)
    }
    if (module.type == CONJUNCTION) {
      module.state = new Map(module.inputs.map((input) => [input, 'low']))
    }
  })
}

function pushButton(pushCount = null, lowPulseConjunctions = null) {
  /** @type {Message[]} */
  let messages = [{from: 'button', to: 'broadcaster', pulse: 'low'}]
  let low = 0
  let high = 0
  while (messages.length > 0) {
    let message = messages.shift()
    if (debug) {
      console.log(`${message.from} -${message.pulse}-> ${message.to}`)
    }
    if (message.pulse == 'low') {
      low++
    } else {
      high++
    }

    let module = modules.get(message.to)
    if (!module) {
      continue
    }

    if (module.type == 'broadcaster') {
      messages.push(
        ...module.outputs.map((to) => ({
          from: module.name,
          to,
          pulse: message.pulse,
        }))
      )
    } else if (module.type == FLIP_FLOP) {
      if (message.pulse == 'low') {
        module.state = module.state == 'off' ? 'on' : 'off'
        messages.push(
          ...module.outputs.map((to) => ({
            from: module.name,
            to,
            pulse: module.state == 'on' ? 'high' : 'low',
          }))
        )
      }
    } else if (module.type == CONJUNCTION) {
      module.state.set(message.from, message.pulse)
      let pulse = [...module.state.values()].every((pulse) => pulse == 'high')
        ? 'low'
        : 'high'
      messages.push(
        ...module.outputs.map((to) => ({
          from: module.name,
          to,
          pulse,
        }))
      )
      // For part 2
      if (
        lowPulseConjunctions?.has(module.name) &&
        lowPulseConjunctions.get(module.name) == null &&
        pulse == 'low'
      ) {
        lowPulseConjunctions.set(module.name, pushCount)
      }
    }
  }
  // Fpr part 1
  return [low, high]
}

console.log('Part 1')
// The cycle detection below is only needed when trying to replicate the 2
// example answers - cheekily, the actual input will not loop within 1,000
// button presses.
function originalStateReached() {
  for (let module of modules.values()) {
    if (module.type == FLIP_FLOP) {
      if (module.state != 'off') return false
    } else if (module.type == CONJUNCTION) {
      if (![...module.state.values()].every((pulse) => pulse == 'low'))
        return false
    }
  }
  return true
}

resetModules()
let lows = []
let highs = []
let pushCount = 0
do {
  let [low, high] = pushButton(++pushCount)
  if (debug) {
    console.log()
  }
  lows.push(low)
  highs.push(high)
} while (!originalStateReached() && pushCount < 1000)

let cycles = Math.floor(1000 / lows.length)
let offset = 1000 % lows.length
let totalLows = cycles * sum(lows.flat())
let totalHighs = cycles * sum(highs.flat())
if (offset > 0) {
  totalLows += sum(lows.slice(0, offset))
  totalHighs += sum(highs.slice(0, offset))
}
console.log('answer:', totalLows * totalHighs)
console.log()

console.log('Part 2')
if (process.argv[2] == 'test') {
  console.log('only applicable to the real input')
  process.exit()
}

// Basd on inspection of the puzze input, following inputs and outputs from rx
// upwards leads to a number of conjunctions which all need to send a low pulse
// at the same time for rx to receive one.
let modulesList = [...modules.values()]
// prettier-ignore
let conjunctionNames = modulesList
  .find((module) => module.outputs?.includes('rx'))
  .inputs
  .map((name) => modulesList.find((module) => module.outputs.includes(name)))
  .map((module) => module.name)
let lowPulseConjunctions = new Map(conjunctionNames.map((name) => [name, null]))

resetModules()
pushCount = 0
do {
  pushButton(++pushCount, lowPulseConjunctions)
} while ([...lowPulseConjunctions.values()].includes(null))

console.log('answer:', lcm([...lowPulseConjunctions.values()]))
