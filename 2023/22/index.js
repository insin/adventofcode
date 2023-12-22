const fs = require('fs')
const {Range} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/**
 * @typedef {{
 *  name?: string
 *  x: Range
 *  y: Range
 *  z: Range
 *  supports: Brick[]
 *  supportedBy: Brick[]
 * }} Brick
 */

let debug = process.argv[2] != null

/**
 * Bricks sorted from lowest to highest z
 * @type {Brick[]}
 */
let bricks = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line, index) => {
    let nums = line.match(/\d+/g).map(Number)
    return {
      name:
        process.argv[2] == 'test' ? 'ABCDEFG'.charAt(index) : String(index + 1),
      x: new Range(nums[0], nums[3]),
      y: new Range(nums[1], nums[4]),
      z: new Range(nums[2], nums[5]),
      supports: [],
      supportedBy: [],
    }
  })
  .sort((a, b) => a.z.end - b.z.end)

/**
 * @param {Brick[]} bricksToDrop
 */
function drop(bricksToDrop) {
  for (let [index, brick] of bricksToDrop.entries()) {
    let settled = false
    while (brick.z.start > 1 && !settled) {
      for (let bi = 0; bi < index; bi++) {
        let otherBrick = bricksToDrop[bi]
        if (
          // Directly above other brick
          brick.z.start == otherBrick.z.end + 1 &&
          // x, y area overlaps other brick
          brick.x.intersection(otherBrick.x) &&
          brick.y.intersection(otherBrick.y)
        ) {
          brick.supportedBy.push(otherBrick)
          otherBrick.supports.push(brick)
          settled = true
        }
      }
      if (!settled) {
        // Move brick down
        brick.z.add(-1)
      }
    }
  }
}

console.log('Part 1')
drop(bricks)

if (debug) {
  for (let brick of bricks) {
    console.log(
      ...[
        brick.name,
        brick.supports.length > 0 && [
          'supports',
          brick.supports.map((b) => b.name),
        ],
        brick.supportedBy.length > 0 && [
          'supported by',
          brick.supportedBy.map((b) => b.name),
        ],
      ]
        .filter(Boolean)
        .flat()
    )
  }
}

let safeToDisintegrate = bricks.filter(
  (brick) =>
    brick.supports.length == 0 ||
    // Can't be safely disintegrated if it's the only brick supporting another
    brick.supports.every(
      (supportedBrick) => supportedBrick.supportedBy.length > 1
    )
)
console.log('answer:', safeToDisintegrate.length)
console.log()

console.log('Part 2')
// Re-sort bricks from lowest to highest z for further dropping
bricks.sort((a, b) => a.z.end - b.z.end)
let originalBottoms = new Map(
  bricks.map((brick) => [brick.name, brick.z.start])
)
let totalFalls = 0
for (let brickToDisintegrate of bricks.filter(
  (brick) => !safeToDisintegrate.includes(brick)
)) {
  let clones = bricks
    .filter((brick) => brick != brickToDisintegrate)
    .map((brick) => ({
      name: brick.name,
      x: brick.x.clone(),
      y: brick.y.clone(),
      z: brick.z.clone(),
      supports: [],
      supportedBy: [],
    }))
  drop(clones)
  let willFall = clones.filter(
    (clone) => clone.z.start != originalBottoms.get(clone.name)
  ).length

  if (willFall > 0) {
    totalFalls += willFall
    if (debug) {
      console.log(
        'Disintegrating brick',
        brickToDisintegrate.name,
        `would cause${willFall == bricks.length - 1 ? ' all' : ''}`,
        willFall,
        `other brick${willFall != 1 ? 's' : ''} to fall`
      )
    }
  }
}
console.log('answer:', totalFalls)
