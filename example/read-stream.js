var level = require('..')
var path = require('path')
var db = level(path.join(__dirname, 'data'), { valueEncoding: 'json' })

db.on('leader', function () {
  console.log('i am the leader now')
})

var rs = db.createReadStream()

rs.on('end', function () {
  console.log('(end)')
  process.exit()
})

setInterval(function () {
  var next = rs.read()
  if (next) console.log(next)
}, 250)
