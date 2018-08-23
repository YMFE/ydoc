const path = require('path');
const fs = require('fs-extra');
const utils = require('../utils.js');
const ydoc = require('../ydoc.js');
const ydocConfig = ydoc.config;
let defaultIndexPageName = 'index';
const defaultSummaryPage = 'SUMMARY.md';
const defaultNavPage = 'NAV.md';
const generate = require('../generate.js').generatePage;
const runBatch = require('../generate.js').runBatch;
const parseSummary = require('./summary');
const parseMarkdown = require('./markdown').parseMarkdown;

const parsePage = require('./page.js');
const parseHtml = require('./html.js');
const parseNav = require('./nav');
const emitHook = require('../plugin.js').emitHook;
const url = require('url');
const color = require('bash-color');

function getIndexPath(filepath) {
  let getIndexPathByType = (type) => path.resolve(filepath, defaultIndexPageName + '.' + type);
  let types = ['md', 'jsx', 'html'];
  let contentFilepath;
  for (let index in types) {
    contentFilepath = getIndexPathByType(types[index]);
    if (utils.fileExist(contentFilepath)) {
      return contentFilepath;
    }
  }
  return null;
}

function getBookSummary(filepath) {
  let summaryFilepath = path.resolve(filepath, defaultSummaryPage);
  if (!utils.fileExist(summaryFilepath)) return null;
  let summary = parseMarkdown(summaryFilepath);
  fs.unlinkSync(summaryFilepath);
  return parseSummary(summary);
}

function getNav(filepath) {
  let navFilepath = path.resolve(filepath, defaultNavPage);
  if (!utils.fileExist(navFilepath)) return null;
  let content = parseMarkdown(navFilepath);
  fs.unlinkSync(navFilepath);
  return parseNav(content);
}

function getBookContext(book, page) {
  const context = utils.extend({}, book);
  context.page = page;
  context.config = ydocConfig;
  return context;
}

function handleMdPathToHtml(filepath) {
  let fileObj = path.parse(filepath);
  if (fileObj.ext === '.md' || fileObj.ext === '.jsx') {
    let name = fileObj.name + '.html';
    return path.format({
      dir: fileObj.dir,
      base: name
    })
  } else {
    return path.format({
      dir: fileObj.dir,
      base: fileObj.base
    })
  }
}

exports.parseSite = async function (dist) {
  try {
    await emitHook('init');

    defaultIndexPageName = 'index'
    let indexPath = getIndexPath(dist);
    if (!indexPath) {
      return utils.log.error(`The root directory of site didn't find index page.`)
    }
    ydocConfig.nav = getNav(dist);

    await emitHook('nav', ydocConfig.nav)

    let books = [
      {
        bookpath: dist,
        indexFile: path.basename(indexPath),
        title: ydocConfig.title
      }
    ]
    ydocConfig.nav.menus.forEach(menu => {
      let menuBooks = getBooks(menu.items, dist);
      books = books.concat(menuBooks)
    })
    books = utils.distinct(books, (item) => {
      return item.bookpath + item.indexFile
    })

    for (let j = 0; j < books.length; j++) {
      await parseBook(books[j]);
    }

    let showpath = color.yellow(dist + '/index.html');
    utils.log.ok(`Generate Site "${ydocConfig.title}" ${showpath}`);

    await emitHook('finish')
  } catch (err) {
    utils.log.error(err);
  }
}

function getBooks(menus, dist) {
  let books = [];
  for (let i = 0; i < menus.length; i++) {
    let item = menus[i];
    if (!item.ref || utils.isUrl(item.ref)) {
      continue;
    }

    if (path.isAbsolute(item.ref)) {
      item.ref = '.' + item.ref;
    }
    let bookHomePath = path.resolve(dist, item.ref);
    if (!utils.fileExist(bookHomePath)) continue;

    let indexFile = path.basename(bookHomePath);
    let bookpath = path.dirname(bookHomePath);
    let stats;
    try {
      stats = fs.statSync(bookpath);
    } catch (err) {
      continue;
    }

    if (stats.isDirectory() && item[0] !== '_' && item[0] !== 'style') {
      item.ref = handleMdPathToHtml(item.ref);
      item.absolutePath = path.resolve(dist, item.ref)
      books.push({
        bookpath: bookpath,
        indexFile: indexFile,
        title: item.title
      })

    }
  }
  return books;
}

function getBookInfo(filepath) {
  let page;
  if (path.extname(filepath) === '.md') {
    page = parsePage(parseMarkdown(filepath));
  } else if (path.extname(filepath) === '.jsx') {
    page = {
      title: ydocConfig.title
    }
  } else {
    page = parsePage(parseHtml(filepath));
  }
  return {
    title: page.title || ydocConfig.title,
    description: page.description || ''
  }
}

// Schema
// const bookSchema = {
//   title: 'string',
//   description: 'string',
//   summary: {},
//   nav: {},
//   bookpath: '当前书籍路径',
//   indexPath: '首页相对路径',
//   page: {
//     title: 'string',
//     description: 'string',
//     content: '内容',
//     prev: '上一页连接',
//     next: '下一页链接',
//     releativePath: '相对路径'
//     srcPath: '源文件路径',
//     distPath: '生成文件路径'  
//   },
//   assets: { // assets 资源
//     js: [],
//     css: []
//   },
//   config: {} //ydocConfig 配置
// }

async function parseBook({ bookpath, indexFile, title }) {
  const book = {}; // 书籍公共变量
  let extname = path.extname(indexFile);
  let name = path.basename(indexFile, extname);
  defaultIndexPageName = name;

  let indexPath = path.resolve(bookpath, indexFile);
  if (!utils.fileExist(indexPath)) {
    return;
  }
  let baseInfo = getBookInfo(indexPath);
  let summary = getBookSummary(bookpath);

  utils.extend(book, baseInfo);
  book.summary = summary;
  book.bookpath = path.resolve(bookpath, name + '.html')

  // 优先使用导航定义的 title
  book.title = title ? title : book.title;

  await emitHook('book:before', {
    title: book.title,
    description: book.description,
    summary: summary
  });

  const generatePage = generate(bookpath);

  // 解析具体的 html
  generatePage(getBookContext(book, {
    title: book.title,
    srcPath: indexPath,
    distPath: defaultIndexPageName + '.html'
  }))
  if (summary && Array.isArray(summary)) {
    parseDocuments(bookpath, function (absolutePath, releativeHtmlPath, title = '') {
      generatePage(getBookContext(book, {
        title: title,
        srcPath: absolutePath,
        distPath: unescape(releativeHtmlPath)
      }));
    })(summary);
  }

  await runBatch();

  let showpath = color.yellow(bookpath + '/' + defaultIndexPageName + '.html');
  utils.log.ok(`Generate book "${book.title}" ${showpath}`);

  await emitHook('book');

}

// 解析文档 (.md)
function parseDocuments(bookpath, callback) {
  return function _parseDocuments(summary) {
    for (let index = 0; index < summary.length; index++) {
      let item = summary[index];
      if (item.ref) {
        let urlObj = url.parse(item.ref);
        if (urlObj.host) continue;
        let releativePath = urlObj.pathname;
        let absolutePath = path.resolve(bookpath, releativePath);
        let releativeHtmlPath = handleMdPathToHtml(releativePath);
        urlObj.hash = urlObj.hash ? urlObj.hash.toLowerCase() : '';
        item.ref = releativeHtmlPath + urlObj.hash;
        item.absolutePath = absolutePath;
        if (utils.fileExist(unescape(absolutePath))) {
          callback(unescape(absolutePath), releativeHtmlPath, item.title)
        }
      }

      if (item.articles && Array.isArray(item.articles) && item.articles.length > 0) {
        _parseDocuments(item.articles)
      }
    }
  }
}