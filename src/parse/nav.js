const dom = require('./dom');

const SELECTOR_LIST = 'ol, ul';
const SELECTOR_LINK = '> a, p > a';
const SELECTOR_PART = 'h2, h3, h4';

function findList($parent) {
    let $container = $parent.children('.olist');
    if ($container.length > 0) $parent = $container.first();

    return $parent.children(SELECTOR_LIST);
}

function parseList($ul, $) {
    let items = [];

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
        article.items = parseList($sub, $);

        if (!article.title) return;
        items.push(article);
    });

    return items;
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

function parseMenu($) {
    
    let $root = dom.cleanup(dom.root($), $);

    let parts = findParts($root, $);

    let parsedParts = [];
    let part;
    for (let i = 0; i < parts.length; ++i) {
        part = parts[i];
        parsedParts.push({
            title: part.title,
            items: parseList($(part.list), $)
        });
    }

    return parsedParts;
}

function parseTitleAndLogo($){

    let $title = $('h1:first-child');
    let $logo = $('p>img:first-child').first();
    let data = {
        title: $title.text().trim(),
        logo: $logo.attr('src')
    }
    $title.remove();
    $logo.remove();
    return data;
}

function parseNav(html){
    let $ = dom.parse(html);
    let data = parseTitleAndLogo($);
    data.menus = parseMenu($)
    return data;
}

module.exports = parseNav;
