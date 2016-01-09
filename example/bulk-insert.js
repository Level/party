var level = require('../');
var db = level(__dirname + '/data', { valueEncoding: 'json' });

db.on('leader', function () {
  console.log('i am the leader now')
})

var tick = 0

function loop () {
  db.put('hello-' + tick, {hello: 'world-' + tick}, function () {
    console.log('inserted %d values', tick)
    if (tick === 10000) process.exit()
    tick++
    loop()
  })
}

loop()
