const path = require('path');
const fs = require('fs-extra');
const utils = require('../utils.js');
const ydoc = require('../ydoc.js');
const ydocConfig = ydoc.config;
const defaultIndexPage = 'index';
const defaultSummaryPage = 'summary.md';
const defaultNavPage = 'nav.md';
const generate = require('../generate.js').generatePage;
const runBatch = require('../generate.js').runBatch;
const parseSummary = require('./summary');
const parseMarkdown = require('./markdown');
const parsePage = require('./page.js');
const parseHtml = require('./html.js');
const parseNav = require('./nav');
const emitHook = require('../plugin.js').emitHook;
const url = require('url');
const color = require('bash-color');
const noox = require('noox');

utils.noox = new noox(path.resolve(__dirname, '../../theme/template'), {
  relePath: ydoc.relePath
});

function getIndexPath(filepath){
  let getIndexPathByType = (type)=> path.resolve(filepath, defaultIndexPage + '.' + type);
  let types = ['md', 'jsx', 'html'];
  let contentFilepath;
  for(let index in types){
    contentFilepath = getIndexPathByType(types[index]);
    if(utils.fileExist(contentFilepath)){
      return contentFilepath;
    }
  }
}

function getBookSummary(filepath){
  let summaryFilepath = path.resolve(filepath, defaultSummaryPage);
  if(!utils.fileExist(summaryFilepath)) return null;
  let summary = parseMarkdown(summaryFilepath);
  fs.unlinkSync(summaryFilepath);
  return parseSummary(summary);
}

function getNav(filepath){
  let navFilepath = path.resolve(filepath, defaultNavPage);
  if(!utils.fileExist(navFilepath)) return null;
  let content = parseMarkdown(navFilepath);
  fs.unlinkSync(navFilepath);
  return parseNav(content);
}

function getBookContext(book, page){
  const context = utils.extend({}, book);
  context.page = page;
  context.config = ydocConfig;
  return context;
}

function handleMdPathToHtml(filepath){
  let fileObj = path.parse(filepath);
  if(fileObj.ext === '.md'){
    let name = fileObj.base === defaultIndexPage + '.md' ? 'index.html' : fileObj.name + '.html';
    return path.format({
      dir: fileObj.dir,
      base: name
    })
  }else if(fileObj.ext === '.html'){
    return path.format({
      dir: fileObj.dir,
      base: fileObj.base
    })
  }
  let errpath = filepath.substr(ydocConfig.buildPath.length);
  
  utils.log.warn(`The document file ${errpath} only suport md ,html or jsx .`)

  return filepath;

  
}

exports.parseSite =async function(dist){
  try{    
    await emitHook('init');
    let indexPath = await getIndexPath(dist);
    if(!indexPath){
      return utils.log.error(`The root directory of documents didn't find index.html or index.md`)
    }
    
    ydocConfig.nav = getNav(dist);
    const generateSitePage = generate(dist);
    generateSitePage({
      title: ydocConfig.title,
      page: {
        srcPath: indexPath,
        distPath: './index.html'
      },
      config: ydocConfig
    })
    await runBatch();
    let rootFiles = fs.readdirSync(dist);
    for(let index in rootFiles){
      let item = rootFiles[index];
      let bookPath = path.resolve(dist, item);
      let stats = fs.statSync(bookPath);      
      if(stats.isDirectory() && item[0] !== '_' && item[0] !== 'style' ){
        await parseBook(bookPath);
      }
    }

    let showpath = color.yellow( dist + '/index.html');
    utils.log.ok(`Generate Site "${ydocConfig.title}" ${showpath}`);

    await emitHook('finish')
  }catch(err){    
    utils.log.error(err);
  }
  
}

function getBookInfo(filepath){
  let page;
  if(path.extname(filepath) === '.md'){
    page = parsePage(parseMarkdown(filepath));
  }else if(path.extname(filepath) === '.jsx'){    
    page = {
      title: ydocConfig.title
    }
  }else{
    page = parsePage( parseHtml(filepath));
  }
  return {
    title: page.title || ydocConfig.title,
    description: page.description || ''
  }
}

const bookSchema = {
  title: 'string',
  description: 'string',
  summary: {},
  nav: {},
  page: {
    title: 'string',
    description: 'string',
    content: 'string',
    prev: 'string',
    next: 'string',
    srcPath: 'string',
    distPath: 'string'
  },
  asserts: { // asserts 资源
    js: [],
    css: []
  },
  config: {} //ydocConfig 配置
}

async function parseBook(bookpath){
  const book = {}; //书籍公共变量
  let indexPath = await getIndexPath(bookpath);
  if(!indexPath) return ;

  let summary = getBookSummary(bookpath);
  let baseInfo = getBookInfo(indexPath);
  utils.extend(book, baseInfo);
  book.summary = summary;

  await emitHook('book:before', {
    title: book.title,
    description: book.description,
    summary: summary
  });

  const generatePage = generate(bookpath);

  generatePage(getBookContext(book, {
    srcPath: indexPath,
    distPath: './index.html'
  }))
  if(summary && Array.isArray(summary)) {
    await parseDocuments(summary); 
  }

  await runBatch();
  
  let showpath = color.yellow(bookpath+'/index.html');
  utils.log.ok(`Generate book "${book.title}" ${showpath}`);

  async function parseDocuments(summary){
    for(let index = 0; index< summary.length; index++){
      let item = summary[index];
      if(item.ref){
        let urlObj = url.parse(item.ref);
        if(urlObj.host) continue;
        let releativePath = urlObj.pathname;
        let absolutePath = path.resolve(bookpath, releativePath);
        if(utils.fileExist(absolutePath)){          
          let releativeHtmlPath = handleMdPathToHtml(releativePath);
          urlObj.hash = urlObj.hash ? urlObj.hash : '';
          item.ref = releativeHtmlPath + urlObj.hash;
          generatePage(getBookContext(book, {
            srcPath: absolutePath,
            distPath: releativeHtmlPath
          }));
        }
        
      }

      if(item.articles && Array.isArray(item.articles) && item.articles.length > 0){
        parseDocuments(item.articles)
      }
    }
  }
  await emitHook('book');

}