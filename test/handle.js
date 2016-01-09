var test = require('tape');
var level = require('../');
var path = require('path');
var os = require('os');
var tmpdir = require('osenv').tmpdir();
var datadir = path.join(tmpdir, 'level-party-' + Math.random());

test('two handles', function (t) {
    t.plan(1);
    var adb = level(datadir, { valueEncoding: 'json' });
    var bdb = level(datadir, { valueEncoding: 'json' });
    var value = Math.floor(Math.random() * 100000);

    adb.put('a', value, function (err) {
        if (err) t.fail(err);
        var times = 0;

        bdb.get('a', function (err, x) {
            t.equal(x, value);
        });
    });

    t.on('end', function () {
        adb.close();
        bdb.close();
    });
});
