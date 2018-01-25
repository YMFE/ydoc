var fs = require('fs');
var path = require('path');
var assert = require('assert');
var utils = require('../../src/utils');

var nx = require('noox');
utils.noox = new nx();
var jsx = require('../../src/parse/jsx');

describe('jsx', function(){  
  it('data', function(){
    let component = jsx(path.resolve(__dirname, './fixtures/jsx.jsx'), 'utf8');
    assert.deepEqual(component.data, {
      "title": "ydoc",
      "list": [
        {
          "id": 1,
          "name": "joy"
        }
      ],
      "author": "ymfe"
    })
  })
})