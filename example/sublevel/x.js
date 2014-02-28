var level = require('../');
var sublevel = require('level-sub');
var db = sublevel(level('/tmp/db', { encoding: 'json' }));
var xxx = db.sublevel('xxx');
xxx.createReadStream().on('data', function (row) {
    console.log(row);
});
