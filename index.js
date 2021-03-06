'use strict'

const level = require('level')
const { pipeline } = require('stream')
const fs = require('fs')
const net = require('net')
const path = require('path')
const multileveldown = require('multileveldown')

module.exports = function (dir, opts = {}) {
  const sockPath = process.platform === 'win32'
    ? '\\\\.\\pipe\\level-party\\' + path.resolve(dir)
    : path.join(dir, 'level-party.sock')

  opts = { retry: true, ...opts }

  const client = multileveldown.client(opts)

  client.open(tryConnect)

  function tryConnect () {
    if (!client.isOpen()) {
      return
    }

    const socket = net.connect(sockPath)
    let connected = false

    socket.on('connect', function () {
      connected = true
    })

    // we pass socket as the ref option so we dont hang the event loop
    pipeline(socket, client.createRpcStream({ ref: socket }), socket, function () {
      // TODO: err?

      if (!client.isOpen()) {
        return
      }

      const db = level(dir, opts, function (err) {
        if (err) {
          // TODO: This can cause an invisible retry loop that never completes
          // and leads to memory leaks.
          if (connected) {
            tryConnect()
          } else {
            setTimeout(tryConnect, 100)
          }
          return
        }

        fs.unlink(sockPath, function (err) {
          if (err && err.code !== 'ENOENT') {
            // TODO: Is this how to forward errors?
            db.emit('error', err)
            return
          }

          if (!client.isOpen()) {
            return
          }

          const sockets = new Set()
          const server = net.createServer((sock) => {
            if (sock.unref) {
              sock.unref()
            }

            sockets.add(sock)

            pipeline(sock, multileveldown.server(db), sock, function () {
              // TODO: err?
              sockets.delete(sock)
            })
          })

          client.close = shutdown
          client.emit('leader')
          client.forward(db)

          server.listen(sockPath, onlistening)
            .on('error', function () {
              // TODO: Is this how to forward errors?
              // TODO: tryConnect()?
              db.emit('error', err)
            })

          function shutdown (cb) {
            for (const sock of sockets) {
              sock.destroy()
            }

            server.close(() => {
              db.close(cb)
            })
          }

          function onlistening () {
            if (server.unref) {
              server.unref()
            }

            if (client.isFlushed()) {
              return
            }

            const sock = net.connect(sockPath)

            pipeline(sock, client.createRpcStream(), sock, function () {
              // TODO: err?
            })

            client.once('flush', function () {
              sock.destroy()
            })
          }
        })
      })
    })
  }

  return client
}
