const dom = require('./dom.js');
const utils = require('../utils');
let ids = [];

function handleArchor($){
  let prefix = '';
  $('h2,h3').each(function(){
    let tagname =  $(this).get(0).tagName;
    let text = $(this).text();
    if(tagname === 'h2'){
      prefix = text + '-';
    }else{
      text = prefix + text;
    }
    let id = utils.hashEncode(text);
    if(ids.indexOf(id) === -1){
      ids.push(id);
    }else{
      utils.log.warn(`The document ${tagname} title: "${text}" repeated.`)
    }
    id = id.toLowerCase();
    $(this).attr('id', id)
  })

  return $.html()
}

module.exports = function parsePage(html, archor){
  const $ = dom.parse(html);
  let page = {
      title: $('h1:first-child').text().trim(),
      description: $('div.paragraph,p').first().text().trim(),
      content: html
  };
  ids = [];

  if(archor)page.content = handleArchor($);
  return page;
}