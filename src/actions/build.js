var fs = require('fs');
var sysPath = require('path');
var colors = require('colors');
var mkdirp = require('mkdirp');
var artTemplate = require('art-template');
var marked = require('marked');
var glob = require('glob');

var parsers = require('../parsers');

artTemplate.config('escape', false);

artTemplate.helper('markdown', function(content) {
    return marked(content);
});

artTemplate.helper('anchor', function(name) {
    return name ? name.replace(/[\.\:]/g, '-') : '';
});

artTemplate.helper('txt', function(html) {
    return html ? html.replace(/\<\/?[^\>]*\>/g, '') : '';
});

function doParser(cwd, filePath, ignore, compile, options, conf, codeRender) {
    var extName = sysPath.extname(filePath),
        parser;
    if (compile) {
        parsers.some(function(p) {
            if (p.type == compile) {
                parser = p;
                return true;
            }
        });
    } else {
        parsers.some(function(p) {
            if (p.extNames.indexOf(extName) > -1) {
                parser = p;
                return true;
            }
        });
    }
    if (parser) {
        var files = glob.sync(filePath, {
                cwd: cwd,
                ignore: ignore || []
            }),
            options = Object.assign({
                files: files
            }, conf.options[parser.type] || {}, options || {});

        if (files.length) {
            var contents = files.map(function(fp) {
                var content = fs.readFileSync(sysPath.join(cwd, fp), 'UTF-8');
                if (options.source) {
                    var dp = sysPath.join(conf.dest, 'static', sysPath.dirname(fp));
                    mkdirp.sync(dp);
                    fs.writeFileSync(sysPath.join(dp, sysPath.basename(fp) + '.html'), codeRender({
                        title: conf.name + ' : ' + fp,
                        footer: conf.footer,
                        sourceDir: sysPath.relative(dp, sysPath.join(conf.dest, 'source')),
                        type: parser.highlight || parser.type,
                        content: content
                    }), 'UTF-8');
                    console.log(('√ 生成文件: ' + sysPath.join(dp, sysPath.basename(fp) + '.html')).yellow);

                }
                return content;
            });
            var ret = parser.parser(contents, options, conf);
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
                    url: item.url,
                    title: item.title,
                    active: item.name == page.name
                }
            });
            data.banner = page.banner;
            if (page.intro) {
                var introPath = sysPath.join(cwd, page.intro);
                if (fs.existsSync(introPath)) {
                    data.intro = marked(fs.readFileSync(introPath, 'UTF-8'));
                }
            }
            if (page.content && (!conf.buildPages.length || conf.buildPages.indexOf(page.name) > -1)) {
                if (page.content.multi) {
                    var navs = page.content.pages.map(function(p) {
                        return {
                            name: p.name,
                            sub: false,
                            url: page.name + '-' + p.name + '.html'
                        };
                    });
                    page.content.pages.forEach(function(p, index) {
                        var curNavs = navs.slice(0);
                        data.article = doParser(cwd, p.content, p.ignore, p.compile, p.options, conf, codeRender);
                        if (data.article.menus) {
                            curNavs.splice.apply(curNavs, [index + 1, 0].concat(data.article.menus.filter(function(item) {
                                return !item.sub;
                            })));
                        }
                        data.article.sidebars = curNavs;
                        data.article.name = p.name;
                        fs.writeFileSync(sysPath.join(conf.dest, page.name + '-' + p.name + '.html'), render(data));
                        console.log(('√ 生成文件: ' + sysPath.join(conf.dest, page.name + '-' + p.name + '.html')).yellow);
                    });
                    data.article = doParser(cwd, page.content.index, page.indexIngore, page.indexCompile, page.content.indexOptions, conf, codeRender);
                    data.article.sidebars = navs;
                } else if (typeof page.content == 'string') {
                    data.article = doParser(cwd, page.content, page.ignore, page.compile, page.options, conf, codeRender);
                    if (data.article.menus && data.article.menus.length && !data.article.sidebars) {
                        data.article.sidebars = data.article.menus;
                    }
                } else {
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
                            var ret = doParser(cwd, block.content, block.ignore, block.compile, block.options, conf, codeRender);
                            if (block.name && !block.sub && ret.menus) {
                                ret.menus.forEach(function(item) {
                                    if (!item.sub) {
                                        navs.push({
                                            name: item.name,
                                            sub: true
                                        });
                                    }
                                });
                            }
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
                fs.writeFileSync(sysPath.join(conf.dest, page.name + '.html'), render(data));
                console.log(('√ 生成文件: ' + sysPath.join(conf.dest, page.name + '.html')).yellow);
            }
        });
    }
};

module.exports.usage = '构建文档';

module.exports.setOptions = function(optimist) {
    optimist.alias('t', 'template');
    optimist.describe('t', '模板路径');
    optimist.alias('p', 'page');
    optimist.describe('p', '选择生成的页面，默认生成所有');
    optimist.alias('w', 'watch');
    optimist.describe('w', '监控文件更改，自动编译');
    optimist.alias('o', 'output');
    optimist.describe('o', '指定输出目录');
};
