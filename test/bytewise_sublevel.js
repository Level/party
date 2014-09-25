var test = require('tape');
var level = require('../');
var path = require('path');
var bsub = require('level-sublevel/bytewise');
var os = require('os');
var tmpdir = require('osenv').tmpdir();
var datadir = path.join(tmpdir, 'level-party-' + Math.random());
var bytewise = require('bytewise');

var lopts = { keyEncoding: bytewise, valueEncoding: 'json' };

test('bytewise sublevel', function (t) {
    t.plan(5);
    var a = level(datadir);
    var b = level(datadir);
    var adb = bsub(a, lopts);
    var bdb = bsub(b, lopts);
    var value = Math.floor(Math.random() * 100000);
    
    adb.put([ 'a' ], value, function (err) {
        if (err) t.fail(err);
        var times = 0;
        
        bdb.get([ 'a' ], function (err, x) {
            t.equal(x, value);
        });
        adb.createReadStream().on('data', function (row) {
            t.deepEqual(row.key, [ 'a' ]);
            t.deepEqual(row.value, value);
        });
        bdb.createReadStream().on('data', function (row) {
            t.deepEqual(row.key, [ 'a' ]);
            t.deepEqual(row.value, value);
        });
    });
    
    t.on('end', function () {
        a.close();
        b.close();
    });
});
