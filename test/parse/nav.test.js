var fs = require('fs');
var path = require('path');
var assert = require('assert');

var nav = require('../../src/parse/nav.js');

describe('Nav parsing', function(){
  var LEXED;
  var LEXED_EMPTY;

  before(function() {
    var content = fs.readFileSync(
      path.join(__dirname, './fixtures/nav.html'), 'utf8');
    LEXED = nav(content);
    var contentEmpty = fs.readFileSync(
      path.join(__dirname, './fixtures/nav-empty.html'), 'utf8'
    )
    LEXED_EMPTY = nav(contentEmpty);
  });

  describe('Parts', function(){
    it('title', function(){
      assert.equal(LEXED.title, 'YDoc')
    })
    it('logo', function(){
      assert.equal(LEXED.logo, 'style/images/logo.png')
    })
    it('menusLengh', function(){
      assert.equal(LEXED.menus[0].items.length, 4)
    })
    it('menusContent', function(){
      assert.equal(LEXED.menus[0].items[2].ref, 'documents/index.html')
    })
  })

  describe('Empty Parts', function(){
    it('menus is array', function(){
      assert.equal(LEXED_EMPTY.menus.length, 0);
    })
  })
})