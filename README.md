# level-party

Open a leveldb handle multiple times, transparently upgrading to use
[`multileveldown`](https://npmjs.org/package/multileveldown) when more than 1 process try to use the same leveldb data directory at once and re-electing a new master when the primary unix socket goes down.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/level-party.svg?label=&logo=npm)](https://www.npmjs.com/package/level-party)
[![Node version](https://img.shields.io/node/v/level-party.svg)](https://www.npmjs.com/package/level-party)
[![Travis](https://img.shields.io/travis/com/Level/party.svg?logo=travis&label=)](https://travis-ci.com/Level/party)
[![Coverage Status](https://coveralls.io/repos/github/Level/party/badge.svg)](https://coveralls.io/github/Level/party)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/level-party.svg?label=dl)](https://www.npmjs.com/package/level-party)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Example

Normally with [`level`](https://npmjs.org/package/level), when you try to open
a database handle from more than one process you will get a locking error:

```
events.js:72
        throw er; // Unhandled 'error' event
              ^
OpenError: IO error: lock /home/substack/projects/level-party/example/data/LOCK: Resource temporarily unavailable
    at /home/substack/projects/level-party/node_modules/level/node_modules/level-packager/node_modules/levelup/lib/levelup.js:114:34
```

With `level-party`, the database open will automatically drop down to using
multilevel over a unix socket using metadata placed into the level data
directory transparently.

This means that if you have 2 programs, 1 that gets:

```js
var level = require('level-party')
var db = level(__dirname + '/data', { valueEncoding: 'json' })

setInterval(function () {
  db.get('a', function (err, value) {
    console.log('a=', value)
  })
}, 250)
```

And 1 that puts:

```js
var level = require('level-party')
var db = level(__dirname + '/data', { valueEncoding: 'json' })

var n = Math.floor(Math.random() * 100000)

setInterval(function () {
  db.put('a', n + 1)
}, 1000)
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

## Seamless failover

level-party does seamless failover. This means that if you create a read-stream
and the leader goes down while you are reading that stream level-party will resume your stream on the new leader.

[**This disables leveldb snapshotting**](https://github.com/level/leveldown#snapshots) so if your app relies on this you should disable this by setting `opts.retry = false`

```js
var db = level('./data', { retry: false }) // will not retry streams / gets / puts if the leader goes down
```

## Windows support

`level-party` works on windows as well using named pipes.

## API

### `var db = level(...)`

The arguments are exactly the same as [`level`](https://npmjs.org/package/level). You will sometimes get a real leveldb handle and sometimes get a `multileveldown` handle back in the response.

## Install

With [npm](https://npmjs.org) do:

```
npm install level-party
```

## Contributing

[`Level/party`](https://github.com/Level/party) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2014-present James Halliday and [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg
