const fs = require('fs')
const {Range, uniquePairs} = require('../../utils')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let hailstones = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('\n')
  .map((line) => line.match(/-?\d+/g).map(Number))

let testRange =
  process.argv[2] == 'test'
    ? new Range(7, 27)
    : new Range(200000000000000, 400000000000000)
let total = 0
for (let [
  [x1, y1, z1, vx1, vy1, vz1],
  [x2, y2, z2, vx2, vy2, vz2],
] of uniquePairs(hailstones)) {
  if (debug) {
    console.log()
    console.log(`Hailstone A: ${x1}, ${y1}, ${z1} @ ${vx1}, ${vy1}, ${vz1}`)
    console.log(`Hailstone B: ${x2}, ${y2}, ${z2} @ ${vx2}, ${vy2}, ${vz2}`)
  }
  let s1 = vy1 / vx1
  let s2 = vy2 / vx2
  if (s1 == s2) {
    if (debug) {
      console.log("Hailstones' paths are parallel; they never intersect.")
    }
    continue
  }
  let yi1 = y1 - s1 * x1
  let yi2 = y2 - s2 * x2
  let ix = (yi2 - yi1) / (s1 - s2)
  let iy = s1 * ix + yi1
  let inRange = testRange.includes(ix) && testRange.includes(iy)
  let future = (vx1 > 0 ? ix > x1 : ix < x1) && (vx2 > 0 ? ix > x2 : ix < x2)
  if (inRange && future) total++
}

console.log('Part 1')
console.log('answer:', total)
console.log()

console.log('Part 2')
// Never heard of Z3 before, this is from someone else's solution
let {init} = require('z3-solver')
void (async function () {
  let {Context} = await init()
  let Z3 = Context('main')
  let x = Z3.Real.const('x')
  let y = Z3.Real.const('y')
  let z = Z3.Real.const('z')
  let vx = Z3.Real.const('vx')
  let vy = Z3.Real.const('vy')
  let vz = Z3.Real.const('vz')
  let solver = new Z3.Solver()

  for (let i = 0; i < 3; i++) {
    let stone = hailstones[i]
    let t = Z3.Real.const(`t${i}`)

    solver.add(t.ge(0))
    solver.add(x.add(vx.mul(t)).eq(t.mul(stone[3]).add(stone[0])))
    solver.add(y.add(vy.mul(t)).eq(t.mul(stone[4]).add(stone[1])))
    solver.add(z.add(vz.mul(t)).eq(t.mul(stone[5]).add(stone[2])))
  }

  let isSat = await solver.check()
  if (isSat != 'sat') {
    console.log('not satisfied')
    return
  }

  let model = solver.model()
  let rx = Number(model.eval(x))
  let ry = Number(model.eval(y))
  let rz = Number(model.eval(z))
  console.log('answer:', rx + ry + rz)
})()
