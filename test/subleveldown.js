const test = require('tape')
const level = require('..')
const path = require('path')
const sub = require('subleveldown')
const tmpdir = require('osenv').tmpdir()
const datadir = path.join(tmpdir, 'level-party-' + Math.random())

test('subleveldown on level-party', function (t) {
  t.plan(9)

  const a = level(datadir)
  const b = level(datadir)
  const asub = sub(a, 'test', { valueEncoding: 'json' })
  const bsub = sub(b, 'test')
  const obj = { test: Math.floor(Math.random() * 100000) }

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
