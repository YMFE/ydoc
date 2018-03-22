var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('../src/generate');
var generatePage = generate.generatePage;

describe('generatePage', function(){

  describe('generate:one', function(){
    var bookpath = '/docs'
    var batch = generate.getBatch();
    var page;

    before(function(){      
      batch.splice(0, batch.length)
      generatePage(bookpath)({
        page: {
          srcPath: '/Users/sean/qunar/ydoc/_site/index.jsx',
          distPath: './index.html'
        }
      })
      page = batch[0].context.page;
    })

    
    
    it('length', function(){
      assert.equal(batch.length, 1)
    })
    it('type', function(){
      assert.equal(page.type, 'jsx')
    })
    it('releativePath', function(){
      assert.equal(page.releativePath, './index.html')
    })
    it('distPath', function(){
      assert.equal(page.distPath, '/docs/index.html')
    })
    it('prev', function(){
      assert.equal(page.prev, null)
    })
    it('next', function(){
      assert.equal(page.next, null)
    })
    
  })

  
  describe('generate:two', function(){
    var bookpath = '/docs'
    var batch = generate.getBatch();
    var page;

    before(function(){      
      batch.splice(0, batch.length)
      var generatePageRun = generatePage(bookpath)
      generatePageRun({
        page: {
          srcPath: '/Users/sean/qunar/ydoc/_site/index.jsx',
          distPath: './index.html'
        }
      })
      generatePageRun({
        page: {
          srcPath: '/Users/sean/qunar/ydoc/_site/a.md',
          distPath: './a.html'
        }
      })
      page = batch[1].context.page;
    })
    
    it('length', function(){
      assert.equal(batch.length, 2)
    })
    it('type', function(){
      assert.equal(page.type, 'md')
    })
    it('releativePath', function(){
      assert.equal(page.releativePath, './a.html')
    })
    it('distPath', function(){
      assert.equal(page.distPath, '/docs/a.html')
    })
    it('prev', function(){
      assert.equal(page.prev.releativePath, './index.html')
    })
    it('next', function(){
      assert.equal(page.next, null)
    })

    it('first:next', function(){
      assert.equal(batch[0].context.page.next.releativePath, './a.html')
    })
  })

  
})