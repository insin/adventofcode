const fs = require('fs')
let {Range} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 *   range: Range
 *   destinationOffset: number
 * }} Mapping
 */

let debug = process.argv[2] != null

let [seedsLine, ...mapLines] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')
let seeds = seedsLine.match(/\d+/g).map(Number)
/** @type {Record<string, Mapping[]>} */
let maps = {}
mapLines.forEach((lines) => {
  let [name, ...items] = lines.split('\n')
  maps[name.match(/to-(\w+)/)[1]] = items.map((item) => {
    let [destination, start, length] = item.match(/\d+/g).map(Number)
    return {
      range: new Range(start, start + length - 1),
      destinationOffset: destination - start,
    }
  })
})

console.log('Part 1')

let minLocation = Math.min(
  ...seeds.map((seed) => {
    let trace = [`Seed ${seed}`]
    let location = Object.values(maps).reduce((from, mappings, index) => {
      let mapping = mappings.find(({range}) => range.includes(from))
      let destination = from + (mapping?.destinationOffset ?? 0)
      trace.push(`${Object.keys(maps)[index]} ${destination}`)
      return destination
    }, seed)
    if (debug) {
      console.log(trace.join(', '))
    }
    return location
  })
)
console.log('answer:', minLocation)
console.log()

console.log('Part 2')

let seedRanges = []
for (let i = 0; i < seeds.length; i += 2) {
  let [start, length] = seeds.slice(i, i + 2)
  seedRanges.push(new Range(start, start + length - 1))
}

let locationRanges = Object.values(maps).reduce(
  (sourceRanges, mappings, index) => {
    let destinationRanges = []
    rangeLoop: for (let i = 0; i < sourceRanges.length; i++) {
      let sourceRange = sourceRanges[i]
      for (let mapping of mappings) {
        let intersection = sourceRange.intersection(mapping.range)
        if (intersection) {
          destinationRanges.push(
            new Range(
              intersection.start + mapping.destinationOffset,
              intersection.end + mapping.destinationOffset
            )
          )
          // Remainders
          if (sourceRange.start < intersection.start) {
            sourceRanges.push(
              new Range(sourceRange.start, intersection.start - 1)
            )
          }
          if (sourceRange.end > intersection.end) {
            sourceRanges.push(new Range(intersection.end + 1, sourceRange.end))
          }
          continue rangeLoop
        }
      }
      // No intersections
      destinationRanges.push(sourceRange)
    }
    if (debug) {
      console.log(
        `${Object.keys(maps)[index]}:`,
        sourceRanges.length,
        'ranges checked'
      )
    }
    return destinationRanges
  },
  seedRanges
)

minLocation = Math.min(...locationRanges.map((range) => range.start))
console.log('answer:', minLocation)
