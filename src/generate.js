const path = require('path');
const output = require('./output.js');
const _ = require('underscore');
const batch = [];
const utils = require('./utils.js');

const fs = require('fs-extra');

const parseMarkdown = require('./parse/markdown.js');
const parseHtml = require('./parse/html');
const parsePage = require('./parse/page');
const parseJsx = require('./parse/jsx');
const emitHook = require('./plugin.js').emitHook;

function insertToBatch(transaction){
  batch.push(transaction);
}

function findTransactionBySrcPath(path){
  return _.find(batch, {srcPath: path})
}

exports.runBatch = async function runBatch(){
  if(batch.length === 0) return;
  for(let index=0, l = batch.length; index<l; index++){
    let transaction = batch[index];
    let context = transaction.context;
    let page = transaction.context.page;
    if(page.title){
      context.title = page.title === context.title ? page.title : page.title + '-' + context.title
    }
    let _p, parseJsxInst;
    switch(page.type){
      case 'md'  :         
        _p = parsePage(parseMarkdown(page.srcPath), true);
        break;
      case 'jsx' :
      parseJsxInst = parseJsx(page.srcPath);
      parseJsxInst.data = parseJsxInst.data && typeof parseJsxInst.data === 'object' ? parseJsxInst.data : {};
        _p = {
          title: parseJsxInst.data.title || '',
          description: parseJsxInst.data.description || '',
          content: parseJsxInst.render(Object.assign({}, context, parseJsxInst.data))
        }
        
        break;
      default : _p = {
        content: parseHtml(page.srcPath)
      }
    }

    _p.content = utils.handleMdUrl(findTransactionBySrcPath)(_p.content, path.dirname(page.srcPath))    
    utils.extend(page, _p);
    try{
      await emitHook('page:before', page);
      await output(transaction.context);   
      //避免内存占用太大，使用完立即释放   
      delete transaction.context.page.content;
    }catch(err){
      throw err;
    }
  }
  //batch 任务执行完成后，删除源文件
  batch.forEach(transaction=>{
    if(utils.fileExist(transaction.context.page.srcPath) && transaction.context.page.srcPath !== transaction.context.page.distPath){
      fs.unlinkSync(transaction.context.page.srcPath);
    }
  })
  utils.clearArray(batch);
}

function getType(filepath){  
  return path.extname(filepath).substr(1).toLowerCase();
}

exports.generatePage = function generatePage(bookpath){
  let prevPage = null;  
  
  return function _generatePage(context){    
    const page = context.page;
    if(findTransactionBySrcPath(page.srcPath))return;
    context._bookpath = bookpath;
    let releativePath = page.distPath;
    page.type = getType(page.srcPath);
    page.releativePath = releativePath;
    page.distPath = path.resolve(bookpath, releativePath);
    page.next = null;
    if(prevPage === null){
      page.prev = null;      
    }else{
      page.prev = prevPage.releativePath;
      prevPage.next = releativePath;
    }
    prevPage = page;
    insertToBatch({
      srcPath: page.srcPath,
      context: context
    })
    
  };

}

