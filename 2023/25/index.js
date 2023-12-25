const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

/** @type {Map<string, {name: string, connections: Set<string>}>} */
let components = new Map()
for (let line of inputs.at(process.argv[2] == 'test' ? 0 : -1).split('\n')) {
  let [name, ...connectedNames] = line.match(/\w+/g)
  let component = components.get(name) ?? {name, connections: new Set()}
  for (let connectedName of connectedNames) {
    component.connections.add(connectedName)
    let connectedComponent = components.get(connectedName) ?? {
      name: connectedName,
      connections: new Set(),
    }
    connectedComponent.connections.add(name)
    components.set(connectedName, connectedComponent)
  }
  components.set(name, component)
}

// Render the generated graph with Graphviz and manually plug in the nodes
// $ dot -Tsvg graph.dot > graph.svg
if (process.argv[2] != 'test') {
  fs.writeFileSync(
    'graph.dot',
    `
digraph {
  ${[...components.values()]
    .map(({name, connections}) => `${name} -> ${[...connections].join(' ')}`)
    .join('\n  ')}
}
`.trim(),
    'utf-8'
  )
}

let connectionsToRemove =
  process.argv[2] == 'test'
    ? [
        ['hfx', 'pzl'],
        ['bvb', 'cmg'],
        ['nvd', 'jqt'],
      ]
    : [
        ['dhl', 'vfs'],
        ['zpc', 'xvp'],
        ['nzn', 'pbq'],
      ]

for (let [a, b] of connectionsToRemove) {
  components.get(a).connections.delete(b)
  components.get(b).connections.delete(a)
}

/**
 * @param {string} start
 */
function getGroupCount(start) {
  let count = 0
  let seen = new Set()
  let queue = [start]
  while (queue.length > 0) {
    let name = queue.shift()
    if (!seen.has(name)) {
      seen.add(name)
      count++
      queue.push(...[...components.get(name).connections])
    }
  }
  return count
}

console.log('Part 1')
console.log(
  'answer:',
  getGroupCount(connectionsToRemove[0][0]) *
    getGroupCount(connectionsToRemove[0][1])
)
