var fs = require('fs');
var sysPath = require('path');
var colors = require('colors');
var artTemplate = require('art-template');
var markdown = require('markdown').markdown;

var parsers = require('../parsers');

artTemplate.config('escape', false);

artTemplate.helper('markdown', function(content) {
    return markdown.toHTML(content);
});

artTemplate.helper('anchor', function(name) {
    return name ? name.replace(/[\.\:]/g, '-') : '';
});

artTemplate.helper('txt', function(html) {
    return html ? html.replace(/\<\/?[^\>]*\>/g, '') : '';
});

function doParser(cwd, filePath, options, conf) {
    var extName = sysPath.extname(filePath),
        parser;
    parsers.some(function(p) {
        if (p.extNames.indexOf(extName) > -1) {
            parser = p;
            return true;
        }
    });
    if (parser) {
        var filePath = sysPath.join(cwd, filePath);
        if (fs.existsSync(filePath)) {
            var ret = parser.parser(fs.readFileSync(filePath, 'UTF-8'), options || {}, conf);
            return ret;
        } else {
            console.log(('X ' + filePath + ' 未找到文件。').red);
        }
    } else {
        console.log(('X ' + extName + ' 未找到编译器。').red);
    }
    return {};
}

module.exports = function(cwd, conf) {
    conf.cwd = cwd;
    var render = artTemplate.compile(conf.templateContent);
    if (conf.pages) {
        conf.pages.forEach(function(page) {
            var data = {},
                common = conf.common || {};
            data.name = conf.name;
            data.title = common.title + ' ' + page.title;
            data.footer = common.footer;
            data.home = common.home;
            data.homeUrl = common.homeUrl;
            data.navbars = common.navbars.map(function(item) {
                return {
                    name: item.name,
                    url: item.url,
                    target: item.target || 'self',
                    active: item.name == conf.name
                };
            });
            data.tabs = conf.pages.map(function(item) {
                return {
                    name: item.name,
                    title: item.title,
                    active: item.name == page.name
                }
            });
            data.banner = page.banner;
            if (page.content) {
                if (page.content.multi) {
                    var navs = page.content.pages.map(function(p) {
                        return {
                            name: p.name,
                            sub: false,
                            url: page.name + '-' + p.name + '.html'
                        };
                    });
                    page.content.pages.forEach(function(p) {
                        data.article = doParser(cwd, p.content, p.options, conf);
                        data.article.sidebars = navs;
                        fs.writeFileSync(sysPath.join(conf.dist, page.name + '-' + p.name + '.html'), render(data));
                    });
                    data.article = doParser(cwd, page.content.index, page.content.indexOptions, conf);
                    data.article.sidebars = navs;
                } else if (typeof page.content == 'string') {
                    data.article = doParser(cwd, page.content, page.options, conf);
                } else if (page.content.type == 'blocks') {
                    var navs = [],
                        blocks = [];
                    page.content.blocks.forEach(function(block) {
                        if (block.name) {
                            navs.push({
                                name: block.name,
                                sub: block.sub || false
                            });
                        }
                        if (typeof block.content == 'string') {
                            var ret = doParser(cwd, block.content, block.options, conf);
                            ret.name = block.name;
                            ret.sub = block.sub || false;
                            blocks.push(ret);
                        } else {
                            blocks.push({
                                type: 'html',
                                name: block.name,
                                sub: false,
                                content: ''
                            });
                        }
                    });
                    data.article = {
                        type: 'block'
                    };
                    if (page.content.sidebar) {
                        data.article.sidebars = navs;
                    }
                    data.article.blocks = blocks;
                }
            }
            fs.writeFileSync(sysPath.join(conf.dist, page.name + '.html'), render(data));
        });
    }
};
