var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');
var markdown = require('markdown').markdown;
var formatter = require('atropa-jsformatter');

var componentKeywords = ['component', 'property', 'method'];
var componentTPL = fs.readFileSync(sysPath.join(__dirname, './component.html'), 'UTF-8');
var libTPL = fs.readFileSync(sysPath.join(__dirname, './lib.html'), 'UTF-8');

function getCommentType(comment, commentKeywords) {
    var tags = comment.tags;
    for (var i = 0, l = tags.length; i < l; i++) {
        if (commentKeywords.indexOf(tags[i].tag) > -1) {
            return tags[i].tag;
        }
    }
    return void 0;
}

var execFns = {
    'component': function(commentList, options, conf) {
        var ret = {
            description: '',
            props: [],
            methods: []
        };
        commentList.forEach(function(comment) {
            switch (getCommentType(comment, componentKeywords)) {
                case 'component':
                    ret._desc = comment.description;
                    comment.tags.forEach(function(tag) {
                        ret[tag.tag] = tag.source.slice(tag.tag.length + 2);
                    });
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
                    }
                    break;
                case 'property':
                    var prop = {
                        _desc: comment.description,
                        description: '',
                        params: []
                    };
                    comment.tags.forEach(function(tag) {
                        if (tag.tag == 'param') {
                            prop.params.push({
                                name: tag.name,
                                type: tag.type,
                                optional: tag.optional,
                                description: tag.description
                            });
                        } else {
                            prop[tag.tag] = tag.source.slice(tag.tag.length + 1);
                        }
                    });
                    ret.props.push(prop);
                    break;
                case 'method':
                    var method = {
                        _desc: comment.description,
                        description: '',
                        params: []
                    };
                    comment.tags.forEach(function(tag) {
                        if (tag.tag == 'param') {
                            method.params.push({
                                name: tag.name,
                                type: tag.type,
                                optional: tag.optional,
                                description: tag.description
                            });
                        } else if (tag.tag == 'returns' || tag.tag == 'return') {
                            method.returns = {
                                type: tag.type,
                                name: tag.source.slice(tag.tag.length + tag.type.length + 4)
                            };
                        } else {
                            method[tag.tag] = tag.source.slice(tag.tag.length + 1);
                        }
                    });
                    ret.methods.push(method);
                    break;
            }
        });
        return {
            type: 'html',
            content: artTemplate.compile(componentTPL)(ret)
        };
    },
    'lib': function(commentList, options, conf) {
        var ret = {
            type: 'html',
            content: '',
            sidebars: []
        };
        var categories = options.categories || [],
            contentMapping = {},
            content = [],
            list = [],
            cores = [];

        categories.forEach(function(category) {
            contentMapping[category] = [];
        });

        if (commentList.length) {
            commentList.forEach(function(comment) {
                var description = comment.description,
                    tags = comment.tags;
                try {
                    if (tags.length) {
                        var typeItem = tags.filter(function(tag) {
                            return ~['method', 'property', 'class', 'prototype', 'event'].indexOf(tag.tag);
                        });
                        if (typeItem.length > 0) {
                            typeItem = typeItem[0];
                            var info = {
                                'class': typeItem.tag,
                                id: typeItem.name,
                                name: typeItem.name.substring(typeItem.name.lastIndexOf('.') + 1),
                                _desc: description,
                                type: null,
                                alias: null,
                                category: null,
                                core: false,
                                value: false,
                                requires: [],
                                params: [],
                                prototypes: [],
                                'returns': false,
                                testCase: false,
                                example: false,
                                explain: false,
                                'private': false,
                                description: ''
                            };
                            tags.forEach(function(tag) {
                                switch (tag.tag) {
                                    case 'type':
                                        info.type = tag.type;
                                        break;
                                    case 'core':
                                        info.core = true;
                                        break;
                                    case 'private':
                                        info.private = true;
                                        break;
                                    case 'alias':
                                        info.alias = tag.name;
                                        break;
                                    case 'value':
                                        info.value = tag.name;
                                        break;
                                    case 'category':
                                        info.category = tag.name;
                                        if (!~categories.indexOf(info.category)) {
                                            categories.push(info.category);
                                            contentMapping[info.category] = [];
                                        }
                                        contentMapping[info.category].push(info);
                                        break;
                                    case 'require':
                                        info.requires.push(tag.name);
                                        break;
                                    case 'param':
                                        info.params.push({
                                            name: tag.name,
                                            type: tag.type,
                                            optional: tag.optional,
                                            description: tag.description
                                        });
                                        break;
                                    case 'prototype':
                                        info.prototypes.push({
                                            name: tag.name,
                                            type: tag.type,
                                            optional: tag.optional,
                                            description: tag.description
                                        });
                                        break;
                                    case 'return':
                                    case 'returns':
                                        info.returns = {
                                            name: tag.name,
                                            type: tag.type,
                                            optional: tag.optional,
                                            description: tag.description
                                        };
                                        break;
                                    case 'example':
                                        info.example = tag.source.slice(tag.tag.length + 1);
                                        if (info.example.indexOf('./') == 0) {
                                            var fp = sysPath.join(conf.cwd, conf.examplePath, info.example.split('[')[0]);
                                            if (fs.existsSync(fp)) {
                                                var ct = fs.readFileSync(fp, 'UTF-8');
                                                var lines = (info.example.split('[')[1] || '').split(']')[0].split('-').map(function(item) {
                                                    return parseInt(item.trim());
                                                });
                                                if (lines.length == 2) {
                                                    ct = ct.split('\n').slice(lines[0], lines[1] - lines[0] + 1).join('\n');
                                                }
                                                info.example = ct.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                                            }
                                        } else {
                                            info.example = formatter(info.example);
                                        }
                                        break;
                                    case 'explain':
                                    case 'description':
                                        info.description = tag.source.slice(tag.tag.length + 1) || '';
                                        break;
                                }
                            });
                            if (info.class == 'method' || (info.type || '').toLowerCase() == 'function') {
                                info.title = info.id + '( ' + info.params.filter(function(param) {
                                    return !~param.name.indexOf('.');
                                }).reduce(function(str, item, index) {
                                    if (item.optional) {
                                        str += '[';
                                    }
                                    if (index !== 0) {
                                        str += ', ';
                                    }
                                    str += item.name;
                                    if (item.optional) {
                                        str += ']';
                                    }
                                    return str;
                                }, '') + ' )';
                            } else {
                                info.title = info.id;
                            }
                            list.push(info);
                            if (info.core) {
                                cores.push(info);
                            }
                        }
                    }
                } catch (e) {
                    console.log('Error', description, e, Object.keys(e));
                    process.exit(1);
                }
            });
        }

        cores.sort(function(a, b) {
            return a.id > b.id ? 1 : -1;
        });

        categories.forEach(function(category) {
            content.push({
                name: category,
                list: contentMapping[category]
            });
        });

        ret.sidebars.push({
            name: '核心API',
            list: cores.map(function(core) {
                return {
                    api: true,
                    name: core.id,
                    tag: 'core-' + core.id,
                    alias: core.alias,
                    description: core.description
                };
            })
        });

        content.forEach(function(cont) {
            ret.sidebars.push({
                name: cont.name,
                list: cont.list.map(function(item) {
                    return {
                        api: true,
                        name: item.id
                    };
                })
            });
        });

        ret.sidebarType = 'expand';

        ret.content = artTemplate.compile(libTPL)({
            core: cores,
            list: content
        });

        return ret;
    }
}

module.exports = {
    type: "js",
    extNames: ['.js'],
    parser: function(content, options, conf) {
        var commentList = commentParser(content),
            fn = execFns[options.type || 'component'];
        return fn ? fn(commentList, options, conf) : {};
    }
};
