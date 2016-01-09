var level = require('level');
var has = require('has');
var pump = require('pump');
var fs = require('fs');
var net = require('net');
var path = require('path');
var multileveldown = require('multileveldown');

module.exports = function (dir, opts) {
    if (!opts) opts = {};
    if (!has(opts, 'retry')) opts.retry = true;

    var sockPath = process.platform === 'win32' ?
        '\\\\.\\pipe\\level-party\\' + path.resolve(dir) :
        path.join(dir, 'level-party.sock');

    var client = multileveldown.client(opts);

    client.open(tryConnect);

    function tryConnect () {
        if (!client.isOpen()) return;

        var socket = net.connect(sockPath);
        var connected = false;

        socket.on('connect', function () {
            connected = true;
        });

        // we pass socket as the ref option so we dont hang the event loop
        pump(socket, client.createRpcStream({ref: socket}), socket, function () {
            if (!client.isOpen()) return;

            var db = level(dir, opts);

            db.on('error', onerror);
            db.on('open', onopen);

            function onerror (err) {
                db.removeListener('open', onopen);
                if (err.type === 'OpenError') {
                    if (connected) return tryConnect();
                    setTimeout(tryConnect, 100);
                }
            }

            function onopen () {
                db.removeListener('error', onerror);
                fs.unlink(sockPath, function (err) {
                    if (err && err.code !== 'ENOENT') return db.emit('error', err);
                    if (!client.isOpen()) return;

                    var sockets = [];
                    var down = client.db;

                    var server = net.createServer(function (sock) {
                        if (sock.unref) sock.unref();
                        sockets.push(sock);
                        pump(sock, multileveldown.server(db), sock, function () {
                            sockets.splice(sockets.indexOf(sock), 1);
                        });
                    });

                    client.db = db.db;
                    client.close = shutdown;
                    client.emit('leader');
                    down.forward(db.db);

                    server.listen(sockPath, onlistening);

                    function shutdown (cb) {
                        sockets.forEach(function (sock) {
                            sock.destroy();
                        });
                        server.on('close', function () {
                            db.close(cb);
                        });
                        server.close();
                    }

                    function onlistening () {
                        if (server.unref) server.unref();
                        if (down.isFlushed()) return;

                        var sock = net.connect(sockPath);
                        pump(sock, down.createRpcStream(), sock);
                        client.once('flush', function () {
                            sock.destroy();
                        });
                    }
                });
            }
        });
    };

    return client;
};
