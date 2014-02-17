var level = require('../');
var db = level(__dirname + '/data', { encoding: 'json' });

var n = Math.floor(Math.random() * 100000);

setInterval(function () {
    db.put('a', n++);
}, 1000);
