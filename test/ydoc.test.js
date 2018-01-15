var fs = require('fs');
var path = require('path');
var assert = require('assert');
var ydoc = require('../src/ydoc');

describe('ydoc', function(){
  describe('version', function(){
    it('hasVersion', function(){
      assert.ok(ydoc.version);
    })
  })

  describe('config', function(){
    it('hasConfig', function(){
      assert.ok(ydoc.config.title)
    })
  })

  describe('relePath', function(){
    it('relePath', function(){
      let srcPath = '/Users/sean/qunar/ydoc/src/logger.js';
      let importPath = '/Users/sean/qunar/ydoc/style/common.js';
      assert.equal(ydoc.relePath(srcPath, importPath), '../style/common.js')
    })
  })

  describe('addAssert', function(){
    it('addJsAssert', function(){
      ydoc.addAssert('a.js', 'js')
      let filepath = ydoc.asserts.js.pop();
      assert.equal(filepath, 'a.js');
    })
    it('addCssAssert', function(){
      ydoc.addAssert('a.css', 'css')
      let filepath = ydoc.asserts.css.pop();
      assert.equal(filepath, 'a.css');
    })
  })
})