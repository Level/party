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
    var sockfile = path.join(dir, 'level-multihandle.sock');
    
    db.once('error', onerror);
    db.once('open', onopen);
    
    function onerror (err) {
        db.removeListener('open', onopen);
        if (err.type === 'OpenError') createStream();
    }
    
    function onopen (times) {
        db.removeListener('error', onerror);
        
        var server = net.createServer(function (stream) {
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
            var close = db.close;
            db.close = function () {
                server.close();
                return close.apply(this, arguments);
            };
            proxy.swap(db);
        }
    }
    
    function createStream () {
        var xdb = multilevel.client();
        
        (function connect () {
            var stream = net.connect(sockfile);
            stream.on('connect', function () {
                proxy.swap(xdb);
                db.emit('open');
                
                var close = xdb.close;
                xdb.close = function () {
                    stream.removeListener('end', onend);
                    stream.end();
                    return close.apply(this, arguments);
                };
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
