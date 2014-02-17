var level = require('../');
var db = level(__dirname + '/data', { encoding: 'json' });

setInterval(function () {
    db.get('a', function (err, value) {
        console.log('a=', value);
    });
}, 250);
