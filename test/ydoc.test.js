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

  describe('addAsset', function(){
    it('addJsAssert', function(){
      ydoc.addAsset('a.js', 'js')
      let filepath = ydoc.getAssets('js').pop();
      assert.equal(filepath, 'a.js');
    })
    it('addCssAssert', function(){
      ydoc.addAsset('a.css', 'css')
      let filepath = ydoc.getAssets('css').pop();
      assert.equal(filepath, 'a.css');
    })
  })
})