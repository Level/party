var level = require('../../');
var sublevel = require('level-sublevel');
var db = sublevel(level('/tmp/db', { encoding: 'json' }));
db.sublevel('xxx').batch([
  { type: 'put', key: Math.random(), value: Math.random() },
  { type: 'put', key: Math.random(), value: Math.random() },
  { type: 'put', key: Math.random(), value: Math.random() },
  { type: 'put', key: Math.random(), value: Math.random() }
]);
