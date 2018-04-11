const utils = require('../utils.js');
const fs = require('fs-extra');
const MarkdownIt = require('markdown-it');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/index.js');

utils.md = MarkdownIt({
  html: true,
  linkify: false,
  highlight: function (str, lang) {
    // js => javascript
    if (lang.toLowerCase() === 'js') {
      lang = 'javascript';
    }
    try {
      if (lang) {
        loadLanguages([lang]);
        return Prism.highlight(str, Prism.languages[lang], lang);;
      }
      return str;
    } catch (err) {
      return str;
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

exports.parseMarkdown = function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return utils.md.render(content);
}