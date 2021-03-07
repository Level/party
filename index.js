'use strict'

const level = require('level')
const { pipeline: pump } = require('readable-stream')
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

    // Pass socket as the ref option so we dont hang the event loop.
    pump(socket, client.createRpcStream({ ref: socket }), socket, function () {
      // TODO: err?

      if (!client.isOpen()) {
        return
      }

      const db = level(dir, opts, onopen)

      function onopen (err) {
        if (err) {
          // TODO: This can cause an invisible retry loop that never completes
          // and leads to memory leaks.
          // TODO: What errors should be retried?
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
          const server = net.createServer(function (sock) {
            if (sock.unref) {
              sock.unref()
            }

            sockets.add(sock)
            pump(sock, multileveldown.server(db), sock, function () {
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
            pump(sock, client.createRpcStream(), sock, function () {
              // TODO: err?
            })
            client.once('flush', function () {
              sock.destroy()
            })
          }
        })
      }
    })
  }

  return client
}
