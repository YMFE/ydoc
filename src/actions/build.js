var fs = require('fs');
var sysPath = require('path');
var colors = require('colors');
var mkdirp = require('mkdirp');
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

function doParser(cwd, filePath, options, conf, codeRender) {
    var extName = sysPath.extname(filePath),
        parser;
    parsers.some(function(p) {
        if (p.extNames.indexOf(extName) > -1) {
            parser = p;
            return true;
        }
    });
    if (parser) {
        var fp = sysPath.join(cwd, filePath),
            options = Object.assign({
                path: filePath
            }, conf.options[parser.type] || {}, options || {});
        if (fs.existsSync(fp)) {
            var content = fs.readFileSync(fp, 'UTF-8');
            if (options.source) {
                var dp = sysPath.join(conf.dist, 'static', sysPath.dirname(filePath));
                mkdirp.sync(dp);
                fs.writeFileSync(sysPath.join(dp, sysPath.basename(filePath) + '.html'), codeRender({
                    title: conf.name + ' : ' + filePath,
                    footer: conf.footer,
                    sourceDir: sysPath.relative(dp, sysPath.join(conf.dist, 'source')),
                    type: parser.type,
                    content: content
                }), 'UTF-8');
            }
            var ret = parser.parser(content, options, conf);
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
    conf.options = conf.options || {};
    var render = artTemplate.compile(conf.templateContent);
    var codeRender = artTemplate.compile(conf.codeTemplateContent);
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
                        data.article = doParser(cwd, p.content, p.options, conf, codeRender);
                        data.article.sidebars = navs;
                        fs.writeFileSync(sysPath.join(conf.dist, page.name + '-' + p.name + '.html'), render(data));
                    });
                    data.article = doParser(cwd, page.content.index, page.content.indexOptions, conf, codeRender);
                    data.article.sidebars = navs;
                } else if (typeof page.content == 'string') {
                    data.article = doParser(cwd, page.content, page.options, conf, codeRender);
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
                            var ret = doParser(cwd, block.content, block.options, conf, codeRender);
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
