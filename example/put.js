var level = require('..')
var path = require('path')
var db = level(path.join(__dirname, 'data'), { valueEncoding: 'json' })

db.on('leader', function () {
  console.log('i am the leader now')
})

var n = Math.floor(Math.random() * 100000)

setInterval(function () {
  db.put('a', n++, function (err) {
    if (err) throw err
  })
}, 1000)
