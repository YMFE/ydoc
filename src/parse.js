const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils.js');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const dom = require('./dom');
const ydoc = require('./ydoc.js');

function getBookContent(filepath){
  let contentFilepath = path.resolve(filepath, './README.md');
  if(!utils.fileExist(contentFilepath)) return;
  let content = parseMarkdown(contentFilepath);
  return parsePage(content);
}

function getBookSummary(filepath){
  let summaryFilepath = path.resolve(filepath, './SUMMARY.md');
  if(!utils.fileExist(summaryFilepath)) return;
  let summary = parseMarkdown(summaryFilepath);

}

exports.parseBook = function parseBook(bookpath){
  const book = {}; //书籍公共变量
  let bookContent = getBookContent(bookpath);
  utils.extend(book, {
    title: bookContent.title,
    description: bookContent.description
  });
  generatePage(path.resolve(bookpath, './index.html'), book, bookContent);

  
  function parseDocuments(bookpath){
    let mds = fs.readdirSync(bookpath);
    mds.forEach(item=>{
      let documentPath = path.resolve(bookpath, item);
      if(item === 'README.md') return;
      let type = documentType(documentPath);
      switch(type){
        case 'dir' : parseDocuments(documentPath); break;
        case 'md'  : 
          let html = parseMarkdown(documentPath);
          let page = parsePage(html);
          generatePage(documentPath, book, page);
      }
    })
  }
}

function documentType(documentPath){
  let stats = fs.statSync(documentPath);
  if(stats.isDirectory()){
    return 'dir';
  }else if(stats.isFile() && path.extname(documentPath) === '.md'){
    return 'md';
  }else {
    return 'file';
  }
}

function handleMdPathToHtml(filepath){
  if(path.extname(filepath) === '.md'){
    filepath = filepath.substr(0, filepath.length - 2) + 'html';
  }
  return filepath;
}


function generatePage(filepath, data, page){
  filepath = handleMdPathToHtml(filepath);
  let context = {}
  utils.extend(context, ydoc);
  console.log(context);
  context.title = page.title + '-' + ydoc.title;


  fs.writeFileSync(filepath, page.content)
}

function parsePage(html){
  const $ = dom.parse(html);
  return {
      title: $('h1:first-child').text().trim(),
      description: $('div.paragraph,p').first().text().trim(),
      content: html
  };
}

function parseSummary(content){

}



function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return md.render(content);
}

