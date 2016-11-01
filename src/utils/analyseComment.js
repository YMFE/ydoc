var fs = require('fs'),
    sysPath = require('path'),
     marked = require('marked');

function getContent(tag) {
    //console.log('======tag==',tag);
    return tag.source.substring(tag.tag.length + 2);
}

function readTag(tag) {
    var minVersion = '',
        maxVersion = '',
        instructionsMd ='',
        instructionsUrl='';
    (tag.source || '').replace(/\{instruInfo\:([\s\S]+?)\}/g, function(a,b) {
        instructionsMd = b.trim();
        return '';
    }).replace(/\{instruUrl\:([\s\S]+?)\}/g, function(a,b) {
        instructionsUrl = b.trim();
        return '';
    });
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
        instructionsUrl: instructionsUrl,
        instructionsMd: instructionsMd,
        version: minVersion + ((maxVersion && (' <del>' + maxVersion + '</del>')) || '')
    };

    if (maxVersion) {
        ret.name = '<del>' + ret.name + '</del>';
        ret.type = '<del>' + ret.type + '</del>';
        ret.description = '<del>' + ret.description + '</del>';
    }
    return ret;
};

module.exports = function (comment, path, conf, formatter, content) {
    var ret = {
        _desc: comment.description,
        _line: comment.line,
        _path: path,
        params: [],
        prototypes: [],
        instruction: [],
        //property: [],
        description: ''
    };
    comment.tags.forEach(function(tag) {
        var content = getContent(tag).replace(/[0-9]+space/g, function(mat) {
            var cnt = mat.replace(/[^0-9]+/g, ''), str = '';
            while(cnt--) {
                str += ' ';
            }
            return str;
        });
        switch (tag.tag) {
            case 'param':
                ret.params.push(readTag(tag));
                break;
            case 'prototype':
                ret.prototypes.push(readTag(tag));
                break;
            case 'instructions':
                var instructions= readTag(tag);
                if(instructions.instructionsMd){
                    if(conf.instructionsInfoPath){
                        var fp = sysPath.join(conf.instructionsInfoPath,instructions.instructionsMd);
                    }else{
                        var fp = instructions.instructionsMd;
                    }
                    if (fs.existsSync(fp)) {
                        var ct =marked(fs.readFileSync(fp, 'UTF-8'));
                        instructions.instructionsMd = ct;
                    }
                }
                if(instructions.instructionsUrl){
                    if(conf.instructionsUrlPath){
                        if (conf.instructionsUrlPath.indexOf('./') == 0) {
                            var fp = sysPath.join(conf.instructionsUrlPath,instructions.instructionsUrl);
                        }else{
                            var fp = conf.instructionsUrlPath+sysPath.join(instructions.instructionsUrl);
                        }
                    }else{
                        var fp = instructions.instructionsUrl;
                    }
                    instructions.instructionsUrl = fp;
                }
                ret.instruction.push(instructions);
                break;
            // case 'property': // kami
            //     ret.property.push(readTag(tag));
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
                // jsx
                if (content.indexOf('./') == 0) {
                    if(conf.examplePath){
                        var fp = sysPath.join(conf.cwd, conf.examplePath, content.split('[')[0]);
                    }else{
                        var fp = sysPath.join(conf.cwd, content.split('[')[0]);
                    }
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
                if (formatter) {
                    ret.example = formatter(ret.example);
                }
                ret.example = content.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
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
