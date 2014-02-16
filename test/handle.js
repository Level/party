var test = require('tape');
var level = require('../');
var path = require('path');
var tmpdir = require('os').tmpdir();
var datadir = path.join(tmpdir, 'level-multilevel-' + Math.random());

test('two handles', function () {
    var adb = level(datadir, { encoding: 'json' });
    var bdb = level(datadir, { encoding: 'json' });
    var n = Math.floor(Math.random() * 100000);
    
    adb.put('a', n + 1, function (err) {
        if (err) t.fail(err);
        var times = 0;
        
        setTimeout(function f () {
            bdb.get('a', function (err, value) {
                if (n !== values && times++ < 20) {
                    return setTimeout(f, 250);
                }
                t.equal(n, value);
            });
        }, 250);
    });
});
