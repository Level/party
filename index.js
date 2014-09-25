var level = require('level');
var multilevel = require('multilevel');
var levelProxy = require('level-proxy');
var net = require('net');
var fs = require('fs');
var path = require('path');
var has = require('has');
var manifest = require('level-manifest')({
    methods: {
        _iteratorCreate: { type: 'async' },
        _iteratorNext: { type: 'async' },
        _iteratorEnd: { type: 'async' }
    }
});

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
            var iterators = {};
            if (!db.methods) db.methods = {};
            
            db.methods._iteratorCreate = { type: 'async' };
            db._iteratorCreate = function (ix, opts) {
                iterators[ix] = (db.iterator && db.iterator(opts))
                    || (db.db && db.db.iterator && db.db.iterator(opts))
                ;
            };
            
            db.methods._iteratorNext = { type: 'async' };
            db._iteratorNext = function (ix, cb) {
                if (!has(iterators, ix)) cb(new Error('no such iterator'))
                else iterators[ix].next(cb);
            };
            
            db.methods._iteratorEnd = { type: 'async' };
            db._iteratorEnd = function (ix, cb) {
                if (!has(iterators, ix)) cb(new Error('no such iterator'))
                else iterators[ix].end(cb)
            };
            
            stream.on('error', function (err) { cleanup() });
            stream.once('end', cleanup);
            stream.pipe(multilevel.server(db)).pipe(stream);
            
            function cleanup () {
                Object.keys(iterators).forEach(function (ix) {
                    iterators[ix].end(function () {});
                });
                iterators = null;
            }
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
        var xdb = multilevel.client(manifest);
        
        var iteratorIx = 0;
        xdb.iterator = function (opts) {
            var ix = iteratorIx ++;
            xdb._iteratorCreate(ix, opts);
            
            return { next: next, end: end };
            function next (cb) { xdb._iteratorNext(ix, cb) }
            function end (cb) { xdb._iteratorEnd(ix, cb) }
        };
        
        (function connect () {
            var stream = net.connect(sockfile);
            stream.on('connect', function () {
                xdb.open = function () {};
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
