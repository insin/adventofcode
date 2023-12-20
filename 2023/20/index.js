const fs = require('fs')
const lcm = require('compute-lcm')
const {sum} = require('../../utils')
let inputs = ['example1', 'example2', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
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
 *   state: Map<string, string>
 * }} Conjunction
 */

let debug = process.argv[2] != null

const FLIP_FLOP = '%'
const CONJUNCTION = '&'

/** @type {Array<Broadcaster | Conjunction | FlipFlop>} */
let modules
/** @type {Map<string, Broadcaster | Conjunction | FlipFlop>} */
let modulesMap

function resetModules() {
  modules = inputs
    .at(process.argv[2] == 'test' ? 1 : -1)
    .split('\n')
    .map((line) => {
      let [name, outputs] = line.split(' -> ')
      if (name == 'broadcaster') {
        return {
          type: 'broadcaster',
          name: 'broadcaster',
          outputs: outputs.split(', '),
        }
      } else if (name.charAt(0) == FLIP_FLOP) {
        return {
          type: '%',
          name: name.substring(1),
          inputs: [],
          outputs: outputs.split(', '),
          state: 'off',
        }
      } else if (name.charAt(0) == CONJUNCTION) {
        return {
          type: '&',
          name: name.substring(1),
          inputs: [],
          outputs: outputs.split(', '),
          state: new Map(),
        }
      }
    })

  // Let modules know about their inputs and initialise conjunction state
  for (let mod of modules) {
    if (mod.type == FLIP_FLOP || mod.type == CONJUNCTION) {
      mod.inputs = modules
        .filter((from) => from.outputs.includes(mod.name))
        .map((from) => from.name)
    }
    if (mod.type == CONJUNCTION) {
      mod.state = new Map(mod.inputs.map((input) => [input, 'low']))
    }
  }

  modulesMap = new Map(modules.map((mod) => [mod.name, mod]))
}

function pushButton(pushCount = null, lowPulseConjunctions = null) {
  let messages = [{from: 'button', to: 'broadcaster', pulse: 'low'}]
  let low = 0
  let high = 0
  while (messages.length > 0) {
    let message = messages.shift()
    if (message.pulse == 'low') {
      low++
    } else {
      high++
    }
    if (debug) {
      console.log(`${message.from} -${message.pulse}-> ${message.to}`)
    }

    let mod = modulesMap.get(message.to)
    if (!mod) continue

    let nextPulse
    if (mod.type == 'broadcaster') {
      nextPulse = message.pulse
    } else if (mod.type == FLIP_FLOP) {
      if (message.pulse == 'low') {
        mod.state = mod.state == 'off' ? 'on' : 'off'
        nextPulse = mod.state == 'on' ? 'high' : 'low'
      }
    } else if (mod.type == CONJUNCTION) {
      mod.state.set(message.from, message.pulse)
      nextPulse = [...mod.state.values()].every((pulse) => pulse == 'high')
        ? 'low'
        : 'high'
      // For part 2
      if (
        nextPulse == 'low' &&
        lowPulseConjunctions &&
        lowPulseConjunctions.has(mod.name) &&
        lowPulseConjunctions.get(mod.name) == null
      ) {
        lowPulseConjunctions.set(mod.name, pushCount)
      }
    }

    if (nextPulse) {
      messages.push(
        ...mod.outputs.map((to) => ({
          from: mod.name,
          to,
          pulse: nextPulse,
        }))
      )
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
  for (let mod of modules) {
    if (mod.type == FLIP_FLOP) {
      if (mod.state != 'off') return false
    } else if (mod.type == CONJUNCTION) {
      if (![...mod.state.values()].every((pulse) => pulse == 'low'))
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
let conjunctionNames = modules
  .find((mod) => mod.outputs.includes('rx'))
  // @ts-ignore
  .inputs.map((name) => modules.find((mod) => mod.outputs.includes(name)))
  .map((mod) => mod.name)
let lowPulseConjunctions = new Map(conjunctionNames.map((name) => [name, null]))

resetModules()
pushCount = 0
do {
  pushButton(++pushCount, lowPulseConjunctions)
} while ([...lowPulseConjunctions.values()].includes(null))

console.log('answer:', lcm([...lowPulseConjunctions.values()]))
