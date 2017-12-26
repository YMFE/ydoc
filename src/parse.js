const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils.js');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const dom = require('./dom');
const ydoc = require('./ydoc.js');
const defaultIndexPage = 'README.md';
const defaultSummaryPage = 'SUMMARY.md';
const generate = require('./generate.js').generatePage;
const runBatch = require('./generate.js').runBatch;
const parseSummary = require('./summary');

function getBookContent(filepath){
  let contentFilepath = path.resolve(filepath, defaultIndexPage);
  if(!utils.fileExist(contentFilepath)) return;
  let content = parseMarkdown(contentFilepath);
  return parsePage(content);
}

function getBookSummary(filepath){
  let summaryFilepath = path.resolve(filepath, defaultSummaryPage);
  if(!utils.fileExist(summaryFilepath)) return null;
  let summary = parseMarkdown(summaryFilepath);
  fs.unlink(summaryFilepath);
  return parseSummary(summary);
}

function getBookContext(book, page){
  const context = utils.extend({}, book);
  context.page = page;
  return context;
}

function handleMdPathToHtml(filepath){
  let hashRegexp = /#[\S]*$/;
  
  let hashStr = filepath.match(hashRegexp);
  if(hashStr)filepath = filepath.replace(hashRegexp, '');
  let fileObj = path.parse(filepath);
  if(fileObj.ext === '.md'){
    let name = fileObj.base === defaultIndexPage ? 'index.html' : fileObj.name + '.html';
    return path.format({
      dir: fileObj.dir,
      base: hashStr ? name + hashStr : name
    })
  }
  throw new Error(`The File ${filepath} isn't md type`)
}

exports.parseSite =async function(dist){
  try{
    let rootFiles = fs.readdirSync(dist);
    for(let index in rootFiles){
      let item = rootFiles[index];
      let bookPath = path.resolve(dist, item);
      let stats = fs.statSync(bookPath);      
      if(stats.isDirectory() && item[0] !== '_' && item[0] !== 'style' ){
        await parseBook(bookPath);
      }
    }
  }catch(err){
    console.error(err)
  }
  
}

// const bookSchema = {
//   title: README.md.title,
//   description: README.md.description,
//   page:{  //Current page data
//     title:'',
//     content: ''
//   },
//   summary: null or Object
// }



const summaryData = [
  {
    "title": "",
    "articles": [
      {
        "title": "Chapter 1",
        "ref": "chapter-1/README.md",
        "articles": [
          {
            "title": "Article 1",
            "ref": "chapter-1/ARTICLE1.md",
            "articles": []
          },
          {
            "title": "Article 2",
            "ref": "chapter-1/ARTICLE2.md",
            "articles": [
              {
                "title": "article 1.2.1",
                "ref": "chapter-1ARTICLE-1-2-1.md",
                "articles": []
              },
              {
                "title": "article 1.2.2",
                "ref": "chapter-1/ARTICLE-1-2-2.md",
                "articles": []
              }
            ]
          }
        ]
      },
     
      {
        "title": "Chapter 4",
        "ref": "chapter-4/README.md",
        "articles": [
          {
            "title": "Unfinished article",
            "articles": []
          }
        ]
      },
      {
        "title": "Unfinished Chapter",
        "articles": []
      }
    ]
  },
  {
    "title": "",
    "articles": [
      {
        "title": "Chapter 1",
        "ref": "chapter-1/README.md",
        "articles": []
      }
    ]
  }
]

async function parseBook(bookpath){
  const book = {}; //书籍公共变量
  const documents = {};
  let page = getBookContent(bookpath);
  
  let summary = getBookSummary(bookpath);
  utils.extend(book, {
    title: page.title || ydoc.title,
    description: page.description || ydoc.description,
    summary: summary
  });
  const generatePage = generate(bookpath);

  generatePage(handleMdPathToHtml(defaultIndexPage), getBookContext(book, page))
  fs.unlink(path.resolve(bookpath, defaultIndexPage));

  if(summary && Array.isArray(summary)) parseDocuments(summary);

  runBatch();

  utils.log.ok();

  function parseDocuments(summary){
    summary.forEach(item=>{
      if(item.ref) {        
        let documentPath = path.resolve(bookpath, item.ref);
        if(utils.fileExist(documentPath)){
          let html = parseMarkdown(documentPath);
          let curPage = parsePage(html);
          curPage.title = curPage.title || item.title;
          generatePage(handleMdPathToHtml(item.ref), getBookContext(book, curPage));
          fs.unlink(documentPath);
        }        
        item.ref = handleMdPathToHtml(item.ref);

      }
      if(item.articles && Array.isArray(item.articles) && item.articles.length > 0){
        parseDocuments(item.articles)
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


function parsePage(html){
  const $ = dom.parse(html);
  return {
      title: $('h1:first-child').text().trim(),
      description: $('div.paragraph,p').first().text().trim(),
      content: html
  };
}



function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return md.render(content);
}

