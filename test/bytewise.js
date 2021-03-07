const test = require('tape')
const level = require('..')
const path = require('path')
const bytewise = require('bytewise')
const tmpdir = require('osenv').tmpdir()
const datadir = path.join(tmpdir, 'level-party-' + Math.random())

const lopts = { keyEncoding: bytewise, valueEncoding: 'json' }

test('bytewise key encoding', function (t) {
  t.plan(7)
  const adb = level(datadir, lopts)
  const bdb = level(datadir, lopts)
  const value = Math.floor(Math.random() * 100000)

  adb.put(['a'], value, function (err) {
    t.ifError(err)

    bdb.get(['a'], function (err, x) {
      t.ifError(err)
      t.equal(x, value)
    })

    adb.createReadStream().on('data', function (row) {
      t.deepEqual(row.key, ['a'])
      t.deepEqual(row.value, value)
    })
    bdb.createReadStream().on('data', function (row) {
      t.deepEqual(row.key, ['a'])
      t.deepEqual(row.value, value)
    })
  })

  t.on('end', function () {
    adb.close()
    bdb.close()
  })
})
