var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rewire = require("rewire");
var plugin = rewire('../src/plugin');

describe('plugin', function(){
  describe('getOptionsSync', function(){
    var xxx;
    plugin.bindHook(
      'page',{ 
        fn : function(){
          xxx = this.options.xxx;
        },
        options: {xxx: 1}
      }
    )

    it('testOptionSync', function(){
      plugin.emitHook('page');
      assert.equal(xxx, 1)
    })

  })

  describe('getOptionsAsync', function(){
    var xxx;
    plugin.bindHook(
      'page',{ 
        fn : function(){
          return new Promise((resolve)=>{
            setTimeout(()=>{
              xxx = this.options.xxx;
              resolve(true)
            }, 200)
          })
        },
        options: {xxx: 2}
      }
    )

    it('testOptionAsync', async function(){
      await plugin.emitHook('page');
      assert.equal(xxx, 2)
    })

  })

  describe('handleAsserts', function(){
    let handleAsserts = plugin.__get__('handleAsserts');
    var _ensureDirSync, _copySync;
    var asserts = [];

    plugin.__set__("_importAssert", function(filepath, type, pluginAssertPath){
      asserts.push({
        filepath
      })
    })

    let ydoc =  plugin.__get__('ydoc');
    ydoc.config.buildPath = '/var1/www/build';

    plugin.__set__("ydoc", ydoc)

    var config = {
      dir: 'asserts',
      js: 'a.js',
      css: ['b.css', 'c.css']
    }
    var dirpath = '/var1/www/ydoc';
    var pluginName = 'test';
    var pluginPath, assertsPath;

    before(function(){
      let FsMock = plugin.__get__('fs');
      asserts = [];
      FsMock.ensureDirSync = function(filepath){
        pluginPath = filepath;
      };
      FsMock.copySync = function(filepath){
        assertsPath = filepath;
      };
      plugin.__set__('fs', FsMock);
    })
    after(function(){
      plugin.__set__('fs', fs)
    })
    

    it('dir-js-css', function(){
      handleAsserts(config, dirpath, pluginName);
      assert.equal(pluginPath, path.resolve(ydoc.config.buildPath, 'ydoc/ydoc-plugin-' + pluginName))
      assert.equal(assertsPath, path.resolve(dirpath, config.dir))
      assert.equal(asserts.length, 3)
      assert.deepEqual(asserts[2],{filepath:  'c.css'})
    })
    
  })
})