const dom = require('./dom');

const SELECTOR_LIST = 'ol, ul';
const SELECTOR_LINK = '> a, p > a';
const SELECTOR_PART = 'h2, h3, h4';

const utils = require('../utils');


function findList($parent) {
    let $container = $parent.children('.olist');
    if ($container.length > 0) $parent = $container.first();

    return $parent.children(SELECTOR_LIST);
}

function parseList($ul, $) {
    let articles = [];

    $ul.children('li').each(function() {
        let article = {};
        let $li = $(this);
        let $p = $li.children('p');
        article.title = ($p.text() ||  dom.textNode($li.get(0))).trim();

        let $a = $li.find(SELECTOR_LINK);
        if ($a.length > 0) {
            article.title = $a.first().text();            
            article.ref = $a.attr('href').replace(/\\/g, '/').replace(/^\/+/, '');
        }

        let $sub = findList($li);
        article.articles = parseList($sub, $);

        if (!article.title) return;
        articles.push(article);
    });

    return articles;
}

function findParts($parent, $) {
    let partsAndLists = $parent.children(SELECTOR_LIST + ', ' + SELECTOR_PART);

    let parts = [];
    let previousPart = null;

    partsAndLists.each(function (i, el) {
        if (isPartNode(el)) {
            if (previousPart !== null) {
                parts.push(previousPart);
            }
            previousPart = {
                title: getPartTitle(el, $),
                list: null
            };

        } else { 
            if (previousPart !== null) {
                previousPart.list = el;
            } else {
                previousPart = {
                    title: '',
                    list: el
                };
            }
            parts.push(previousPart);
            previousPart = null;
        }
    });

    if (previousPart !== null) {
        parts.push(previousPart);
    }

    return parts;
}

function isPartNode(el) {
    return SELECTOR_PART.indexOf(el.name) !== -1;
}


function getPartTitle(el, $) {
    return $(el).text().trim();
}

function parseSummary(html) {
    let $ = dom.parse(html);
   
    let $root = dom.cleanup(dom.root($), $);

    let parts = findParts($root, $);

    let parsedParts = [];
    let part;
    for (let i = 0; i < parts.length; ++i) {
        part = parts[i];
        parsedParts.push({
            title: part.title,
            articles: parseList($(part.list), $)
        });
    }
    return parsedParts;
}

module.exports = parseSummary;
