# level-multihandle

open a leveldb handle multiple times, transparently upgrading to use
[multilevel](https://npmjs.org/package/multilevel) when more than 1 process try
to use the same leveldb data directory at once

Normally with [level](https://npmjs.org/package/level), when you try to open
a database handle from more than one process you will get a locking error:

# example

```
events.js:72
        throw er; // Unhandled 'error' event
              ^
OpenError: IO error: lock /home/substack/projects/level-multihandle/example/data/LOCK: Resource temporarily unavailable
    at /home/substack/projects/level-multihandle/node_modules/level/node_modules/level-packager/node_modules/levelup/lib/levelup.js:114:34
```

With level-multihandle, the database open will automatically drop down to using
multilevel over a unix socket using metadata placed into the level data
directory transparently.

This means that if you have 2 programs, 1 that gets:

``` js
var level = require('level-multihandle');
var db = level(__dirname + '/data', { encoding: 'json' });

setInterval(function () {
    db.get('a', function (err, value) {
        console.log('a=', value);
    });
}, 1000);
```

and 1 that puts:

``` js
var level = require('level-multihandle');
var db = level(__dirname + '/data', { encoding: 'json' });

var n = Math.floor(Math.random() * 100000);

setInterval(function () {
    db.put('a', n + 1);
}, 1000);
```

and you start them up in any order, everything will just work! No more
`IO error: lock` exceptions.

# methods

``` js
var level = require('level-multihandle')
```

## var db = level(...)

The arguments are exactly the same as [level](https://npmjs.org/package/level).
You will sometimes get a real leveldb handle and sometimes get a multilevel
handle back in the response.

# install

With [npm](https://npmjs.org) do:

```
npm install level-multihandle
```

# license

MIT
