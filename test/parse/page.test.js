var fs = require('fs');
var path = require('path');
var assert = require('assert');
var parsePage = require('../../src/parse/page');
var parseMarkdown = require('../../src/parse/markdown').parseMarkdown;
var dom = require('../../src/parse/dom');

describe('parsePage', function(){
  it('handleArchor', function(){
    let html = parseMarkdown(path.resolve(__dirname, './fixtures/markdown.md'), 'utf8');
    let data = parsePage(html, true);
    let $ = dom.parse(data.content);
    let title = [];

    assert.equal(data.title, 'md')
    $('h2,h3').each(function(){
      title.push({
        id: $(this).attr('id'),
        tag: $(this).get(0).tagName,
        text: $(this).text()
      })
    })

    assert.equal(title.length, 5)
    assert.equal(title[0].id, 'title-1')
    assert.equal(title[4].id, 'title-2-title-2.2')
  })
})
