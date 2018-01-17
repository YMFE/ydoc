var fs = require('fs');
var path = require('path');
var assert = require('assert');
var dom = require('../src/parse/dom');
var utils = require('../src/utils');

describe('utils', function(){
  describe('extend', function(){
    it('extend', function(){
      var obj = {};
      var cloneObj = {a:1, b:2}
      utils.extend(obj, {a:1, b:2})
      assert.deepEqual(obj, cloneObj);
    })
  })

  describe('clearArray', function(){
    it('clearArray', function(){
      var arr = [1,2,3];
      utils.clearArray(arr);
      assert.equal(arr.length, 0);
    })
  })

  describe('fileExist', function(){
    it('fileNotExist', function(){
      let status = utils.fileExist('./.testtesttesttesttestteste.js');
      assert.equal(status, false)
    })
    it('fileExist', function(){
      let status = utils.fileExist(path.resolve(__dirname, './parse/nav.test.js'))
      assert.equal(status, true)
    })
  })

  describe('hashEncode', function(){
    assert.equal(utils.hashEncode('aaa kkk ~:#@/()'), 'aaa-kkk-')
  })

  describe('handleMdUrl', function(){
    let fn = utils.handleMdUrl(function(a){
      return true;
    });
    let content = `<a href="a.md" >a</a>`;
    content = fn(content, '/www')
    let $ = dom.parse(content);
    assert.equal($('a').attr('href'), 'a.html')
  })

  describe('handleHtmlUrl', function(){
    let fn = utils.handleMdUrl(function(a){
      return true;
    });
    let content = `<a href="a.ss" >a</a>`;
    content = fn(content, '/www')
    let $ = dom.parse(content);
    assert.equal($('a').attr('href'), 'a.ss')
  })

})