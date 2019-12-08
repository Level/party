var test = require('tape')
var level = require('..')
var path = require('path')
var sub = require('subleveldown')
var tmpdir = require('osenv').tmpdir()
var datadir = path.join(tmpdir, 'level-party-' + Math.random())

test('subleveldown on level-party', function (t) {
  t.plan(9)

  var a = level(datadir)
  var b = level(datadir)
  var asub = sub(a, 'test', { valueEncoding: 'json' })
  var bsub = sub(b, 'test')
  var obj = { test: Math.floor(Math.random() * 100000) }

  asub.put('a', obj, function (err) {
    t.ifError(err)

    asub.get('a', function (err, value) {
      t.ifError(err)
      t.deepEqual(value, obj)
    })
    bsub.get('a', function (err, value) {
      t.ifError(err)
      t.deepEqual(value, JSON.stringify(obj))
    })
    asub.createReadStream().on('data', function (row) {
      t.deepEqual(row.key, 'a')
      t.deepEqual(row.value, obj)
    })
    bsub.createReadStream().on('data', function (row) {
      t.deepEqual(row.key, 'a')
      t.deepEqual(row.value, JSON.stringify(obj))
    })
  })

  t.on('end', function () {
    a.close()
    b.close()
  })
})
