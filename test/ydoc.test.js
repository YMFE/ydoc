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
    it('relePathAbso', function(){
      let srcPath = '/Users/sean/qunar/ydoc/src/logger.js';
      let importPath = '/Users/sean/qunar/ydoc/style/common.js';
      assert.equal(ydoc.relePath(srcPath, importPath), '../style/common.js')
    })

    it('relePathRele', function(){
      let srcPath = 'abs/a/x.html';
      let importPath = 'abs/b/y.html';
      assert.equal(ydoc.relePath(srcPath, importPath), '../b/y.html')
    })
  })

  describe('addAssert', function(){
    it('addJsAssert', function(){
      ydoc.addAssert('a.js', 'js')
      let filepath = ydoc.getAsserts('js').pop();
      assert.equal(filepath, 'a.js');
    })
    it('addCssAssert', function(){
      ydoc.addAssert('a.css', 'css')
      let filepath = ydoc.getAsserts('css').pop();
      assert.equal(filepath, 'a.css');
    })
  })
})