var level = require('../');
var db = level(__dirname + '/data', { valueEncoding: 'json' });

db.on('leader', function () {
  console.log('i am the leader now')
})

setInterval(function () {
    db.get('a', function (err, value) {
        console.log('a=', value);
    });
}, 250);
