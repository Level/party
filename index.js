var level = require('level');
var multilevel = require('multilevel');
var levelProxy = require('level-proxy');
var net = require('net');
var fs = require('fs');
var path = require('path');

module.exports = function (dir, opts) {
    var proxy = levelProxy();
    withProxy(proxy, dir, opts);
    return proxy;
};

function withProxy (proxy, dir, opts) {
    var db = level(dir, opts);
    var sockfile = path.join(dir, 'level-party.sock');
    
    db.once('error', onerror);
    db.once('open', onopen);
    
    function onerror (err) {
        db.removeListener('open', onopen);
        if (err.type === 'OpenError') createStream();
    }
    
    function onopen (times) {
        db.removeListener('error', onerror);
        
        var server = net.createServer(function (stream) {
            stream.on('error', function (err) {});
            stream.pipe(multilevel.server(db)).pipe(stream);
        });
        server.listen(sockfile);
        
        server.once('error', onerror);
        server.once('listening', onlistening);
        
        function onerror (err) {
            server.removeListener('listening', onlistening);
            if (!times && err && err.code === 'EADDRINUSE') {
                fs.unlink(sockfile, function (err) {
                    if (err) db.emit('error', err)
                    else onopen(1)
                });
            }
            else db.emit('error', err);
        }
        
        function onlistening () {
            server.removeListener('error', onerror);
            db.close = function () {
                proxy.swap(null);
                server.close();
            };
            proxy.swap(db);
            proxy.emit('open');
        }
    }
    
    function createStream () {
        var xdb = multilevel.client();
        
        (function connect () {
            var stream = net.connect(sockfile);
            stream.on('connect', function () {
                xdb.close = function () {
                    proxy.swap(null);
                    stream.removeListener('end', onend);
                    stream.end();
                };
                proxy.swap(xdb);
                proxy.emit('open');
            });
            
            stream.on('error', function (err) {
                stream.removeListener('end', onend);
                setTimeout(connect, 50);
            });
            stream.on('end', onend);
            stream.pipe(xdb.createRpcStream()).pipe(stream);
            
            function onend () {
                proxy.swap(null);
                withProxy(proxy, dir, opts);
            }
        })();
    }
}
