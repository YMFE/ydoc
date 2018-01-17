const fs = require('fs')
const logger = require('./logger');
const dom = require('./parse/dom.js');
const url = require('url');
const path = require('path');

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


exports.clearArray = function clearArray(a) {
  return a.splice(0, a.length);
}

exports.fileExist = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

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
