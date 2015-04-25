var level = require('../');
var db = level(__dirname + '/data', { encoding: 'json' });

db.on('leader', function () {
  console.log('i am the leader now')
})

var n = Math.floor(Math.random() * 100000);

setInterval(function () {
    db.put('a', n++);
}, 1000);
