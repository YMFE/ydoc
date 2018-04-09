const cheerio = require('cheerio');
const _ = require('underscore');

function parse(html) {
  let $ = cheerio.load(html, {
    decodeEntities: false
  });
  let $el = $('html, body').first();
  return $el.length > 0 ? $el : $;
}

/**
 * Get root element
 * @param {*} $ 
 */
function root($) {
  let $el = $('html, body, > div').first();
  return $el.length > 0 ? $el : $.root();
}

/**
 * Get element children text content
 * @param {*}  
 */
function textNode($el) {
  return _.reduce($el.children, function (text, e) {
    if (e.type == 'text') text += e.data;
    return text;
  }, '');
}

/**
 * remove div element
 * @param {*}  
 * @param {*} $ 
 */
function cleanup($el, $) {
  $el.find('div').each(function () {
    let $div = $(this);
    cleanup($div, $);

    $div.replaceWith($div.html());
  });

  return $el;
}

module.exports = {
  parse: parse,
  textNode: textNode,
  root: root,
  cleanup: cleanup
};
