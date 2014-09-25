var test = require('tape');
var level = require('../');
var path = require('path');
var bytewise = require('bytewise');
var os = require('os');
var tmpdir = require('osenv').tmpdir();
var datadir = path.join(tmpdir, 'level-party-' + Math.random());

var lopts = { keyEncoding: bytewise, valueEncoding: 'json' };

test('bytewise key encoding', function (t) {
    t.plan(7);
    var adb = level(datadir, lopts);
    var bdb = level(datadir, lopts);
    var value = Math.floor(Math.random() * 100000);
    
    adb.put([ 'a' ], value, function (err) {
        t.ifError(err);
        var times = 0;
        
        bdb.get([ 'a' ], function (err, x) {
            t.ifError(err);
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
        adb.close();
        bdb.close();
    });
});
