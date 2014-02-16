var level = require('level');
var multilevel = require('multilevel');

module.exports = function () {
    var db = level.apply(this, arguments);
    return db;
};
