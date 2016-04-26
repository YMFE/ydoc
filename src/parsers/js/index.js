var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');
var markdown = require('markdown').markdown;

var componentKeywords = ['component', 'property', 'method'];

var componentTPL = fs.readFileSync(sysPath.join(__dirname, './component.html'), 'UTF-8');

function getCommentType(comment, commentKeywords) {
    var tags = comment.tags;
    for (var i = 0, l = tags.length; i < l; i ++) {
        if (commentKeywords.indexOf(tags[i].tag) > -1 ) {
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
