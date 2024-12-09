const fs = require('fs')
let inputs = ['example', 'input'].map((file) =>
  fs.readFileSync(`${file}.txt`, 'utf-8')
)

let debug = process.argv[2] != null

let diskMap = inputs
  .at(process.argv[2] == 'test' ? 0 : -1)
  .split('')
  .map(Number)

let disk = []
let files = []
let id = 0
for (let i = 0; i < diskMap.length; i++) {
  let size = diskMap[i]
  files.push({id, size, index: disk.length})
  for (let j = 0; j < size; j++) {
    disk.push(id)
  }
  let space = diskMap[++i]
  if (space != null) {
    for (let j = 0; j < space; j++) {
      disk.push('.')
    }
  }
  id++
}
if (debug) console.log(disk.join(''))

function checksum(disk) {
  let result = 0
  let i = 0
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] == '.') continue
    result += i * disk[i]
  }
  return result
}

console.log('Part 1')
let disk1 = disk.slice()
let write = 0
let read = disk1.length - 1
while (write < read) {
  while (disk1[read] == '.') read--
  while (disk1[write] != '.') write++
  disk1[write] = disk1[read]
  disk1[read] = '.'
  write++
  read--
}
if (debug) console.log(disk1.join(''))
console.log('answer:', checksum(disk1))
console.log()

console.log('Part 2')
let disk2 = disk.slice()

function findSpace(disk, size) {
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] != '.') continue
    if (size == 1) return i
    for (let j = 1; j <= size - 1; j++) {
      if (disk[i + j] != '.') {
        i += j
        break
      }
      if (j == size - 1) return i
    }
  }
  return null
}

for (let file of files.toReversed()) {
  if (file.id == 0) continue
  let spaceIndex = findSpace(disk2, file.size)
  if (spaceIndex != null && spaceIndex < file.index) {
    for (let i = 0; i < file.size; i++) {
      disk2[spaceIndex + i] = file.id
      disk2[file.index + i] = '.'
    }
  }
}
if (debug) console.log(disk2.join(''))
console.log('answer:', checksum(disk2))
