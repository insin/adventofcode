const fs = require('fs')
const path = require('path')

let year
let day
if (!process.argv[2]) {
  year = new Date().getFullYear()
  day = new Date().getDate()
} else {
  let match = process.argv[2].match(/^(?:(\d{4})\/)?(\d{1,2})$/)
  if (!match) {
    console.error(
      `
usage: npm start
       npm start <day>
       npm start <year>/<day>
    `.trim()
    )
    process.exit(1)
  }
  if (match[1]) {
    year = Number(year)
  }
  day = Number(match[2])
}

if (day < 1 || day > 25) {
  console.error('invalid day:', day)
  process.exit(1)
}

let yearDayPath = path.join(String(year), String(day).padStart(2, '0'))
let created = fs.mkdirSync(yearDayPath, {recursive: true})

if (!created) {
  console.error('directory already exists:', yearDayPath)
  process.exit(1)
}

function touchSync(filename) {
  fs.closeSync(fs.openSync(path.join(yearDayPath, filename), 'a'))
  console.log('created', filename)
}

console.log('created', yearDayPath)
fs.copyFileSync('template.js', path.join(yearDayPath, 'index.js'))
console.log('created', 'index.js')
touchSync('example.txt')
touchSync('input.txt')
