var fs = require('fs'),
    sysPath = require('path');

function getContent(tag) {
    return tag.source.substring(tag.tag.length + 2);
}

function readTag(tag) {
    var minVersion = '',
        maxVersion = '';

    var ret = {
        name: tag.name,
        type: tag.type,
        optional: tag.optional,
        description: (tag.description || '').replace(/\{add\:\s*(\d+\.\d+\.\d+)\s*\}/g, function(a, b) {
            minVersion = b;
            return '';
        }).replace(/\{del\:\s*(\d+\.\d+\.\d+)\s*\}/g, function(a, b) {
            maxVersion = b;
            return '';
        }).replace(/\<\s*(\d+\.\d+\.\d+)\s*(\,\s*(\d+\.\d+\.\d+|\*)\s*)?\>/g, function(a, b, c, d) {
            minVersion = b;
            maxVersion = d != '*' && d;
            return '';
        }),
        version: minVersion + ((maxVersion && (' <del>' + maxVersion + '</del>')) || '')
    };

    if (maxVersion) {
        ret.name = '<del>' + ret.name + '</del>';
        ret.type = '<del>' + ret.type + '</del>';
        ret.description = '<del>' + ret.description + '</del>';
    }

    return ret;
};

module.exports = function (comment, path, conf, formatter) {
    var ret = {
        _desc: comment.description,
        _line: comment.line,
        _path: path,
        params: [],
        prototypes: [],
        description: ''
    };
    comment.tags.forEach(function(tag) {
        var content = getContent(tag);
        switch (tag.tag) {
            case 'param':
                ret.params.push(readTag(tag));
                break;
            case 'prototype':
                ret.prototypes.push(readTag(tag));
            case 'return':
            case 'returns':
                ret.returns = {
                    name: tag.name,
                    type: tag.type,
                    optional: tag.optional,
                    description: tag.description
                };
                break;
            case 'example':
                if (content.indexOf('./') == 0) {
                    var fp = sysPath.join(conf.cwd, conf.examplePath, content.split('[')[0]);
                    if (fs.existsSync(fp)) {
                        var ct = fs.readFileSync(fp, 'UTF-8');
                        var lines = (content.split('[')[1] || '').split(']')[0].split('-').map(function(item) {
                            return parseInt(item.trim());
                        });
                        if (lines.length == 2) {
                            ct = ct.split('\n').slice(lines[0], lines[1] - lines[0] + 1).join('\n');
                        }
                        content = ct;
                    }
                }
                ret.example = content.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
                if (formatter) {
                    ret.example = formatter(ret.example);
                }
                break;
            case 'explain':
            case 'description':
                ret.description = content;
                break;
            default:
                ret[tag.tag] = content || true;
        }
    });

    return ret;
};
