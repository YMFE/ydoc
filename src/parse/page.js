const dom = require('./dom.js');

module.exports = function parsePage(html){
  const $ = dom.parse(html);
  let page = {
      title: $('h1:first-child').text().trim(),
      description: $('div.paragraph,p').first().text().trim(),
      content: html
  };
  return page;
}