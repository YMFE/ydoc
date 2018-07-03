const fs = require('fs-extra')
const logger = require('./logger');
const dom = require('./parse/dom.js');
const url = require('url');
const path = require('path');

exports.defaultDocsPath = './docs';
exports.defaultBuildPath = './_site'
exports.projectPath = process.cwd();
exports.defaultTplHookPrefix = 'tpl:'
/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
exports.extend = function extend(obj, props) {
  for (let i in props) {
    if (props.hasOwnProperty(i)) {
      obj[i] = props[i];
    }
  }
  return obj;
}

exports.distinct = function(arr, fn){
  let data = [], existValue = []
  arr.forEach(item=>{
    let value = fn(item)
    if(existValue.indexOf(value) === -1){
      existValue.push(value)
      data.push(item)
    }
  })
  return data;
}


exports.clearArray = function clearArray(a) {
  return a.splice(0, a.length);
}

function fileExist(filePath){
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}
exports.fileExist = fileExist;


function dirExist(filePath){
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}
exports.dirExist = dirExist;


/**
 * log 输出，一共四个 api:
 *  log.debug(msg)
 *  log.info(msg)
 *  log.warn(msg)
 *  log.error(msg)
 */
exports.log = new logger('info');

exports.hashEncode = function hashEncode(text){
  return text.replace(/[\~\:\#\@\/\(\)]/g, '').replace(/\s+/g, '-');
}

exports.handleMdUrl = (findTransactionBySrcPath) => (content, filepath) => {
  if(!/\.md/.test(content)){
    return content;
  }
  let $ = dom.parse(content);
  let urls = $('a');
  urls.each(function(){
    let item = $(this);
    let href = item.attr('href');
    if(!href) return;
    let urlObj = url.parse(href);

    if(urlObj.hostname){
      return;
    }
    if(!urlObj.path){
      return;
    }
    
    if(path.extname(urlObj.pathname) === '.md'){
      let srcPath = path.resolve(filepath, urlObj.pathname);
      let findTransaction = findTransactionBySrcPath(srcPath);
      if(findTransaction){
        item.attr('href', href.replace('.md', '.html'))
      }
    }
  })
  return $.html()
}

exports.getConfigPath = function getConfigPath(dirname){
  let allowFilename = ['ydoc.json', 'ydoc.js'];
  for(let i =0; i< allowFilename.length; i++){
    let configFilepath = path.resolve(dirname, allowFilename[i]);
    if(fileExist(configFilepath)) return configFilepath;
  }
  return null;
}

exports.getConfig = function getConfig(filepath){
  if(fileExist(filepath)){
    return require(filepath)
  }
  return {};
}

exports.isUrl = function(url){
  return /^https?:\/\//.test(url)
}

/**
 * 递归合并文件
 * @param {*} src 源文件目录
 * @param {*} dist 目标文件目录
 */
function mergeCopyFiles(src, dist){
  let files = fs.readdirSync(src);
  files.forEach(item=>{
    let distPath = path.resolve(dist, item);
    let srcPath = path.resolve(src, item)
    if(fileExist(srcPath)){
      fs.copySync(srcPath, distPath)
    }else if(dirExist(srcPath)){
      mergeCopyFiles(srcPath, distPath)
    }
  })
}

exports.mergeCopyFiles = mergeCopyFiles;