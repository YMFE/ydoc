var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');
var formatter = require('atropa-jsformatter');

var analyseComment = require('../../utils/analyseComment.js');

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
    'component': function(contents, options, conf) {
        var ret = {
            props: [],
            methods: []
        },
        fm = options.format && formatter
        contents.forEach(function(commentList, index) {
            var filePath = options.files[index].substring(1);
            commentList.forEach(function(comment) {
                switch (getCommentType(comment, componentKeywords)) {
                    case 'component':
                        ret = Object.assign(ret, analyseComment(comment, filePath, conf, fm));
                        break;
                    case 'property':
                        ret.props.push(analyseComment(comment, filePath, conf, fm));
                        break;
                    case 'method':
                        ret.methods.push(analyseComment(comment, filePath, conf, fm));
                        break;
                };
            });
        });
        return {
            type: 'html',
            content: artTemplate.compile(componentTPL)(ret)
        };
    },
    'lib': function(contents, options, conf) {
        var ret = {
            type: 'html',
            content: '',
            sidebars: []
        };
        var categories = options.categories || [],
            contentMapping = {},
            content = [],
            list = [];

        categories.forEach(function(category) {
            contentMapping[category] = [];
        });

        contents.forEach(function(commentList, index) {
            commentList.forEach(function(comment) {
                var description = comment.description,
                    tags = comment.tags;
                if (tags.length) {
                    var typeItem = tags.filter(function(tag) {
                        return ~['method', 'property', 'class', 'prototype', 'event'].indexOf(tag.tag);
                    });
                    if (typeItem.length > 0) {
                        typeItem = typeItem[0];
                        var info = analyseComment(comment, options.files[index].substring(1), conf, options.format && formatter);
                        info['class'] = typeItem.tag;
                        info.id = typeItem.name;
                        info.name = typeItem.name.substring(typeItem.name.lastIndexOf('.') + 1);
                        if (!~categories.indexOf(info.category)) {
                            categories.push(info.category);
                            contentMapping[info.category] = [];
                        }
                        contentMapping[info.category].push(info);
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
                    }
                }
            });
        });

        categories.forEach(function(category) {
            content.push({
                name: category,
                list: contentMapping[category]
            });
        });

        content.forEach(function(cont) {
            ret.sidebars.push({
                name: cont.name,
                tag: '#' + cont.name.replace(/[\.\:]/g, '-')
            });
            cont.list.forEach(function(item) {
                ret.sidebars.push({
                    sub: true,
                    name: item.id,
                    tag: item.url || ('#' + item.id.replace(/[\.\:]/g, '-'))
                });
            })
        });

        ret.content = artTemplate.compile(libTPL)({
            linkSource: options.source,
            list: content
        });

        return ret;
    }
}

module.exports = {
    type: "js",
    extNames: ['.js', '.jsx'],
    parser: function(contents, options, conf) {
        var fn = execFns[options.type || 'component'];
        return fn ? fn(contents.map(function(content) {
            return commentParser(content);
        }), options, conf) : {};
    }
};
