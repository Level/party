const test = require('tape')
const level = require('..')
const path = require('path')
const tmpdir = require('osenv').tmpdir()
const datadir = path.join(tmpdir, 'level-party-' + Math.random())

test('two handles', function (t) {
  t.plan(1)

  const adb = level(datadir, { valueEncoding: 'json' })
  const bdb = level(datadir, { valueEncoding: 'json' })
  const value = Math.floor(Math.random() * 100000)

  adb.put('a', value, function (err) {
    if (err) t.fail(err)

    bdb.get('a', function (err, x) {
      if (err) t.fail(err)
      t.equal(x, value)
    })
  })

  t.on('end', function () {
    adb.close()
    bdb.close()
  })
})
