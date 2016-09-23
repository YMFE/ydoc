/**
 * @providesModule ReactPromise
 */


'use strict';

var _Promise = require('./es6-extensions.js')
require('./done.js')

if (self.Promise) {
    _Promise = self.Promise
} else {
    self.Promise = _Promise
}
var _prototype = _Promise.prototype

if (!('finally' in _prototype)) {
    _prototype['finally'] = function(onSettled) {
        return this.then(onSettled, onSettled)
    }
}

if (!('fail' in _prototype)) {
    _prototype['fail'] = function(fn) {
        return this.then(null, fn)
    }
}

if (!('always' in _prototype)) {
    _prototype['always'] = function(onSettled) {
        return this.then(onSettled, onSettled)
    }
}

if (!('done' in _prototype)) {
    _prototype['done'] = function(onSettled) {
        return this.then(onSettled)
    }
}

module.exports = _Promise