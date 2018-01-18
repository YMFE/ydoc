var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rewire = require("rewire");
var parse = rewire('../../src/parse/parse');

describe('parse', function(){
  it('handlePath', function(){
    let ht = parse.__get__('handleMdPathToHtml');
    assert.equal(ht('/a/a.md'), '/a/a.html')
    assert.equal(ht('/a/a.jsx'), '/a/a.html')
    assert.equal(ht('/a/a.html'), '/a/a.html')
    assert.equal(ht('/a/a.x'), '/a/a.x')
  })

  it('getIndexPath', function(){
    let getIndexPath = parse.__get__('getIndexPath');
    let htmlDirpath = path.resolve(__dirname, './fixtures/index-test/html')
    let mdDirpath = path.resolve(__dirname, './fixtures/index-test/md')
    let jsxDirpath = path.resolve(__dirname, './fixtures/index-test/jsx')
    assert.equal(getIndexPath(htmlDirpath), path.resolve(htmlDirpath, 'index.html'))
    assert.equal(getIndexPath(mdDirpath), path.resolve(mdDirpath, 'index.md'))
    assert.equal(getIndexPath(jsxDirpath), path.resolve(jsxDirpath, 'index.jsx'))
  })


})
