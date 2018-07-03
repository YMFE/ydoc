const utils = require('../utils.js');
const fs = require('fs-extra');
const MarkdownIt = require('markdown-it');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/index.js');
const he = require('he');
utils.md = MarkdownIt({
  html: true,
  linkify: false,
  highlight: function (str, lang) {
    try {
      if (lang) {
        // js => javascript
        if (lang.toLowerCase() === 'js') {
          lang = 'javascript';
        }
        // html 的高亮使用 haml 语法
        if (lang.toLocaleLowerCase() === 'html') {
          lang = 'haml';
        }
        loadLanguages([lang]);
        return prism.highlight(str, prism.languages[lang], lang);
      }
      return he.encode(str);
    } catch (err) {
      return he.encode(str);
    }
  }
})

exports.loadMarkdownPlugins = function(fn){
  if(fn && typeof fn === 'function'){
    fn.call(this, utils.md)
  }
}



/**
 *  处理 hash 带特殊字符的问题
 */
utils.md.use(function (md) {
  let urlRegexp = /^\[(.*?)\]\((.*?)\)$/;
  let hashRegexp = /#(.*)/;

  let defaultHtmlRender = md.renderer.rules.html_inline;
  let defaultTextRender = md.renderer.rules.text;

  md.renderer.rules.text = function (tokens, idx, options, env, self) {
    let token = tokens[idx];
    if (!token || !token.content) return defaultTextRender(tokens, idx, options, env, self)
    let content = token.content.trim();
    if (!urlRegexp.test(content)) return defaultTextRender(tokens, idx, options, env, self)
    token.content = content.replace(urlRegexp, function (str, title, url) {
      if (!url) return str;
      url = url.replace(hashRegexp, function (str, match) {
        if(!match) return str;
        return '#' + utils.hashEncode(match)
      })
      return `<a href="${url}" >${title}</a>`;
    })

    return defaultHtmlRender(tokens, idx, options, env, self);
  }
})

/**
 * 处理外链问题
 */

utils.md.use(function(md){
  let defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    let targetIndex = tokens[idx].attrIndex('target');    
    let hrefIndex = tokens[idx].attrIndex('href');  
    let url = tokens[idx].attrGet('href')  
    if (url && /^https?:\/\//.test(url)) {
      if (targetIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
      } else {
        tokens[idx].attrs[targetIndex][1] = '_blank';    // replace value of existing attr
      }          
    }  

    return defaultRender(tokens, idx, options, env, self);
  };
})

exports.parseMarkdown = function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return utils.md.render(content);
}