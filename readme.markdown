# level-party

open a leveldb handle multiple times, transparently upgrading to use
[multilevel](https://npmjs.org/package/multilevel) when more than 1 process try
to use the same leveldb data directory at once and re-electing a new master when
the primary unix socket goes down

[![build status](https://secure.travis-ci.org/substack/level-party.png)](http://travis-ci.org/substack/level-party)

[![level-party](http://substack.net/images/level_party.png)](http://substack.net/images/level_party.svg)

# example

Normally with [level](https://npmjs.org/package/level), when you try to open
a database handle from more than one process you will get a locking error:

```
events.js:72
        throw er; // Unhandled 'error' event
              ^
OpenError: IO error: lock /home/substack/projects/level-party/example/data/LOCK: Resource temporarily unavailable
    at /home/substack/projects/level-party/node_modules/level/node_modules/level-packager/node_modules/levelup/lib/levelup.js:114:34
```

With level-party, the database open will automatically drop down to using
multilevel over a unix socket using metadata placed into the level data
directory transparently.

This means that if you have 2 programs, 1 that gets:

``` js
var level = require('level-party');
var db = level(__dirname + '/data', { valueEncoding: 'json' });

setInterval(function () {
    db.get('a', function (err, value) {
        console.log('a=', value);
    });
}, 250);
```

and 1 that puts:

``` js
var level = require('level-party');
var db = level(__dirname + '/data', { valueEncoding: 'json' });

var n = Math.floor(Math.random() * 100000);

setInterval(function () {
    db.put('a', n + 1);
}, 1000);
```

and you start them up in any order, everything will just work! No more
`IO error: lock` exceptions.

```
$ node put.js & sleep 0.2; node put.js & sleep 0.2; node put.js & sleep 0.2; node put.js & sleep 0.2
[1] 3498
[2] 3502
[3] 3509
[4] 3513
$ node get.js
a= 35340
a= 31575
a= 37639
a= 58874
a= 35341
a= 31576
$ node get.js
a= 35344
a= 31579
a= 37643
a= 58878
a= 35345
^C
```

Hooray!

# seamless failover

level-party does seamless failover. This means that if you create a read-stream
and the leader goes down while you are reading that stream level-party will resume your stream
on the new leader.

[**This disables leveldb snapshotting**](https://github.com/level/leveldown#snapshots) so if your app relies on this you should disable this by setting `opts.retry = false`

``` js
var db = level('./data', {retry: false}) // will not retry streams / gets / puts if the leader goes down
```

# windows support

level-party works on windows as well using named pipes.

# methods

``` js
var level = require('level-party')
```

## var db = level(...)

The arguments are exactly the same as [level](https://npmjs.org/package/level).
You will sometimes get a real leveldb handle and sometimes get a multilevel
handle back in the response.

# install

With [npm](https://npmjs.org) do:

```
npm install level-party
```

# license

MIT
