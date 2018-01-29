var fs = require('fs');
var path = require('path');
var assert = require('assert');
var parseMarkdown = require('../../src/parse/markdown').parseMarkdown;
var dom = require('../../src/parse/dom')

describe('parseMarkdown', function(){
  it('hashHandleTest', function(){
    let html = parseMarkdown(path.resolve(__dirname, './fixtures/markdown.md'), 'utf8');
    let $ = dom.parse(html);
    assert.equal($('a').attr('href'), 'a.md#a-1')
    assert.equal($('a').text(), 'url')
  })
})

