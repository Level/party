var test = require('tape');
var level = require('../');
var path = require('path');
var sub = require('level-sublevel');
var os = require('os');
var tmpdir = require('osenv').tmpdir();
var datadir = path.join(tmpdir, 'level-party-' + Math.random());

test('sublevel', function (t) {
    t.plan(6);
    var db = level(datadir);
    var sdb = sub(db);
    var a = sdb.sublevel('aaa', { valueEncoding: 'json' });
    var b = sdb.sublevel('bbb', { valueEncoding: 'json' });
    
    var value = Math.floor(Math.random() * 100000);
    
    a.put('x', value, function (err) {
        t.ifError(err);
        
        a.get('x', function (err, x) {
            t.ifError(err);
            t.equal(x, value);
        });
        b.get('x', function (err, x) {
            t.ok(err);
        });
        
        a.createReadStream().on('data', function (row) {
            t.deepEqual(row.key, 'x');
            t.deepEqual(row.value, value);
        });
        b.createReadStream().on('data', function (row) {
            t.fail('b should not have rows');
        });
    });
    
    t.on('end', function () {
        db.close();
    });
});
