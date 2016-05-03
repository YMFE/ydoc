var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');

var readParam = require('../../utils/readParam.js');

var pageTPL = fs.readFileSync(sysPath.join(__dirname, './page.html'), 'UTF-8');

module.exports = {
    type: "css",
    extNames: ['.css', '.scss', '.sass'],
    parser: function(contents, options, conf) {
        var groupList = [],
            groups = {},
            sidebars = [],
            rs;
        contents.forEach(function(content, index) {
            var commentList = commentParser(content);
            commentList.forEach(function(item) {
                var ret = {
                    _desc: item.description,
                    _path: options.files[index].substring(1),
                    _line: item.line,
                    params: []
                };
                item.tags.forEach(function(tag) {
                    if (tag.tag == 'param') {
                        ret.params.push(readParam(tag));
                    } else {
                        ret[tag.tag] = tag.source.slice(tag.tag.length + 2);
                    }
                });
                ret.group = ret.class || ret.module;
                ret.name = ret.function || ret.method;
                ret.description = ret.description || ret._desc;
                if (ret.example) {
                    if (ret.example.indexOf('./') == 0) {
                        var fp = sysPath.join(conf.cwd, conf.examplePath, ret.example.split('[')[0]);
                        if (fs.existsSync(fp)) {
                            var ct = fs.readFileSync(fp, 'UTF-8');
                            var lines = (ret.example.split('[')[1] || '').split(']')[0].split('-').map(function(item) {
                                return parseInt(item.trim());
                            });
                            if (lines.length == 2) {
                                ct = ct.split('\n').slice(lines[0], lines[1] - lines[0] + 1).join('\n');
                            }
                            ret.example = ct.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                        }
                    } else {
                        ret.example = ret.example.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                    }
                }
                if (ret.group && ret.name) {
                    if (!groups[ret.group]) {
                        groupList.push(ret.group);
                        groups[ret.group] = [];
                    }
                    groups[ret.group].push(ret);
                }
            });
        });

        rs = {
            list: groupList.map(function(group) {
                sidebars.push({
                    name: group,
                    list: groups[group].map(function(item) {
                        return {
                            name: item.name,
                            tag: item.name
                        };
                    })
                });
                return {
                    name: group,
                    list: groups[group]
                };
            })
        };

        return {
            type: 'html',
            sidebars: sidebars,
            sidebarType: 'expand',
            content: artTemplate.compile(pageTPL)(rs)
        };
    }
};
