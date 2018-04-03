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

  it('getBooksByNav', function(){
    let getBooks = parse.__get__('getBooks');
    let dist = path.resolve(__dirname, 'fixtures');
    let menus = [
      {
        "title": "文档",
        "ref": "markdown.md",
        "items": []
      },
      {
        "title": "文档规范",
        "ref": "index-test/html/index.html",
        "items": []
      },
      {
        "title": "插件",
        "ref": "index-test/jsx/index.jsx",
        "items": []
      },{
        "tilte": "error",
        "ref": "err/error.md",
        "items": []
      },{
        "title": "none",
        "ref": "none.md"
      },{
        "title": "github",
        "ref": "https://github.com/ymfe/yapi"
      }
    ]
    let books = getBooks(menus, dist)
    let result = [{
      bookpath: dist,
      indexFile: 'markdown.md',
      title: '文档'
    },{
      bookpath: path.resolve(dist, 'index-test/html'),
      indexFile: 'index.html',
      title: '文档规范'
    },{
      bookpath: path.resolve(dist, 'index-test/jsx'),
      indexFile: 'index.jsx',
      title: '插件'
    }]
    
    assert.deepEqual(books, result)
  
  })

  it('parseDocuments', function(){
    let parseDocuments = parse.__get__('parseDocuments')
    let bookpath = path.resolve(__dirname, 'fixtures/bookpath');
    let length = 0;
    let callback = function(absolutePath, reletivePath){
      length++;
    }
    let summary = require(path.resolve(bookpath, 'summary.json'));
    parseDocuments(bookpath, callback)(summary)
    assert.equal(length, 6)
  })


})
