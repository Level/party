const level = require('..')
const path = require('path')
const db = level(path.join(__dirname, 'data'), { valueEncoding: 'json' })

db.on('leader', function () {
  console.log('i am the leader now')
})

const rs = db.createReadStream()

rs.on('end', function () {
  console.log('(end)')
  process.exit()
})

setInterval(function () {
  const next = rs.read()
  if (next) console.log(next)
}, 250)
