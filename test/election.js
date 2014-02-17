var test = require('tape');
var level = require('../');
var path = require('path');
var tmpdir = require('os').tmpdir();
var datadir = path.join(tmpdir, 'level-party-' + Math.random());

test('failover election party', function (t) {
    var keys = [ 'a', 'b', 'c', 'e', 'f', 'g' ];
    var pending = keys.length;
    var handles = {};
    
    keys.forEach(function (key) {
        var h = handles[key] = level(datadir, { encoding: 'json' });
        h.on('open', function () {
            if (--pending === 0) ready();
        });
    });
    
    function ready () {
        check(function () {
            console.log('now time to fail');
        });
    }
    
    function check (cb) {
        var pending = keys.length;
        for (var i = 0; i < keys.length - 1; i++) (function (a, b) {
            var value = Math.random();
            handles[a].put(a, value, function (err) {
                if (err) t.fail(err);
                handles[b].get(a, function (err, x) {
                    if (err) t.fail(err);
                    t.equal(x, value);
                    if (--pending === 0) cb();
                });
            });
        })(keys[i], keys[i+1]);
    }
});
