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

  describe('handleAssets', function(){
    let handleAssets = plugin.__get__('handleAssets');
    var _ensureDirSync, _copySync;
    var assets = [];

    plugin.__set__("_importAsset", function(filepath, type, pluginAssetPath){
      assets.push({
        filepath
      })
    })

    let ydoc =  plugin.__get__('ydoc');
    ydoc.config.buildPath = '/var1/www/build';

    plugin.__set__("ydoc", ydoc)

    var config = {
      dir: 'assets',
      js: 'a.js',
      css: ['b.css', 'c.css']
    }
    var dirpath = '/var1/www/ydoc';
    var pluginName = 'test';
    var pluginPath, assetsPath;

    before(function(){
      let FsMock = plugin.__get__('fs');
      assets = [];
      FsMock.ensureDirSync = function(filepath){
        pluginPath = filepath;
      };
      FsMock.copySync = function(filepath){
        assetsPath = filepath;
      };
      plugin.__set__('fs', FsMock);
    })
    after(function(){
      plugin.__set__('fs', fs)
    })
    

    it('dir-js-css', function(){
      handleAssets(config, dirpath, pluginName);
      assert.equal(pluginPath, path.resolve(ydoc.config.dist, 'ydoc/ydoc-plugin-' + pluginName))
      assert.equal(assetsPath, path.resolve(dirpath, config.dir))
      assert.equal(assets.length, 3)
      assert.deepEqual(assets[2],{filepath:  'c.css'})
    })
    
  })
})