const test = require('tape')
const level = require('..')
const path = require('path')
const tmpdir = require('osenv').tmpdir()
const datadir = path.join(tmpdir, 'level-party-' + Math.random())

test('failover election party', function (t) {
  const keys = ['a', 'b', 'c', 'e', 'f', 'g']
  const len = keys.length
  t.plan(len * (len + 1) / 2)
  let pending = keys.length
  const handles = {}

  keys.forEach(function (key) {
    const h = open(key)
    h.on('open', function () {
      if (--pending === 0) spinDown()
    })
  })

  function open (key) {
    const h = handles[key] = level(datadir, { valueEncoding: 'json' })
    return h
  }

  function spinDown () {
    const alive = keys.slice();
    (function next () {
      if (alive.length === 0) return

      check(alive, function () {
        const key = alive.shift()
        handles[key].close()
        next()
      })
    })()
  }

  function check (keys, cb) {
    let pending = keys.length
    if (pending === 0) return cb()
    for (let i = 0; i < keys.length; i++) {
      (function (a, b) {
        const value = Math.random()
        handles[a].put(a, value, function (err) {
          if (err) t.fail(err)
          handles[b].get(a, function (err, x) {
            if (err) t.fail(err)
            t.equal(x, value)
            if (--pending === 0) cb()
          })
        })
      })(keys[i], keys[(i + 1) % keys.length])
    }
  }
})
