const fs = require('fs')
const {Range, sum} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let [workflowInput, ratingsInput] = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n\n')

let workflows = new Map(
  workflowInput.split('\n').map((line) => {
    let [name, rules] = line.match(/(\w+)\{([^}]+)/).slice(1)
    return [
      name,
      rules.split(/,(?=[xmas][<>])/g).map((rule) => {
        let [check, dest] = rule.split(':')
        return {
          part: check.charAt(0),
          op: check.charAt(1),
          value: Number(check.substring(2)),
          dest: dest.split(','),
        }
      }),
    ]
  })
)

let partRatings = ratingsInput.split('\n').map(
  (line) =>
    new Map(
      line
        .substring(1, line.length - 1)
        .split(',')
        .map((partRating) => {
          let [part, rating] = partRating.split('=')
          return [part, Number(rating)]
        })
    )
)

console.log('Part 1')
let accepted = partRatings.filter((partRating) => {
  let workflow = workflows.get('in')
  while (workflow) {
    for (let {part, op, value, dest} of workflow) {
      let rating = partRating.get(part)
      let result = dest[1]
      if (op == '>' ? rating > value : rating < value) {
        result = dest[0]
      }
      if (result) {
        if (result == 'A') {
          return true
        }
        if (result == 'R') {
          return false
        }
        workflow = workflows.get(result)
        break
      }
    }
  }
})
console.log(
  'answer:',
  sum(accepted.map((partRating) => sum([...partRating.values()])))
)
console.log()

console.log('Part 2')

let ranges = [
  {
    x: new Range(1, 4000),
    m: new Range(1, 4000),
    a: new Range(1, 4000),
    s: new Range(1, 4000),
    dest: 'in',
  },
]
let acceptedRanges = []

while (ranges.length > 0) {
  let range = ranges.pop()
  for (let {part, op, value, dest} of workflows.get(range.dest)) {
    // Split the portion matching the current rule out into a new set of ranges
    let splitRange = {
      ...range,
      [part]:
        op == '>'
          ? new Range(value + 1, range[part].end)
          : new Range(range[part].start, value - 1),
      dest: dest[0],
    }
    if (splitRange.dest == 'A') {
      acceptedRanges.push(splitRange)
    } else if (splitRange.dest != 'R') {
      ranges.push(splitRange)
    }

    // Exclude what we just split out from the current range
    range[part] =
      op == '>'
        ? new Range(range[part].start, value)
        : new Range(value, range[part].end)

    // If this is the last rule, give its 'else' result to the current range
    if (dest[1]) {
      range.dest = dest[1]
      if (range.dest == 'A') {
        acceptedRanges.push(range)
      } else if (range.dest != 'R') {
        ranges.push(range)
      }
    }
  }
}

console.log(
  'answer:',
  sum(
    acceptedRanges.map(
      ({x, m, a, s}) => x.length * m.length * a.length * s.length
    )
  )
)
