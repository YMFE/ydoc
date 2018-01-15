var fs = require('fs');
var path = require('path');
var assert = require('assert');
var logger = require('../src/logger');

describe('info logger', function(){
  var log = new logger();  
  it('has', function(){
    assert.ok(log.error)
    assert.ok(log.warn)
    assert.ok(log.info)
    assert.ok(log.ok)
    assert.ok(log.debug)
  })

  it('debug', function(){
    var message;
    log._stdout = function(msg){
      message = msg;
    }
    log.debug('debug');
    assert.equal(message, undefined);
  })
})

describe('debug logger', function(){
  var log = new logger('debug');  
  it('has', function(){
    assert.ok(log.error)
    assert.ok(log.warn)
    assert.ok(log.info)
    assert.ok(log.ok)
    assert.ok(log.debug)
  })

  it('debug', function(){
    var message;
    log._stdout = function(msg){
      message = msg;
    }
    log.debug('debug');
    assert.ok(message);
  })
})