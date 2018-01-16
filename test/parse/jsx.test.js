var fs = require('fs');
var path = require('path');
var assert = require('assert');
var jsx = require('../../src/parse/jsx');
require('../../src/parse/parse');

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