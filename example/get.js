var level = require('..')
var path = require('path')
var db = level(path.join(__dirname, 'data'), { valueEncoding: 'json' })

db.on('leader', function () {
  console.log('i am the leader now')
})

setInterval(function () {
  db.get('a', function (err, value) {
    if (err) throw err
    console.log('a=', value)
  })
}, 250)
