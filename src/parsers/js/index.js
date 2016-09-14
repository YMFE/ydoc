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
            console.log('current~~~~',commentParser(content));
            var afterContents = [];
            // content.replace(/\/\*\*[\s\S]+?\*\//gm, function(mat) {
            //     console.log('mat====',mat);
            //     var mats = mat.split("\n"), i = 1, line, indent = -1, lines = [mats[0]];
            //     while (i < mats.length - 1) {
            //         line = mats[i];
            //         //console.log('line====',line);
            //         if (line.trim() != '*' && indent < 0) {
            //             indent = line.match(/[^*\S]+/g).length;
            //         }
            //
            //         // if (indent > -1) {
            //         //     line = line.substring(0, indent) + line.substring(indent).replace(/^[ ]+/g, function(mat) {
            //         //         return mat.length + 'space'
            //         //     })
            //         // }
            //         lines.push(line);
            //         i++;
            //     };
            //     lines.push(mats[i]);
            //     //console.log('content'+i,lines.join("\n"));
            //     //var beforeLines = lines.join("\n");
            //     // var afterExample;
            //     // //console.log('beforeLines==',beforeLines);
            //     // var resetMat = beforeLines.replace(/\@example[\s\S]+?((\*\/)|\@)/gm,function(item){
            //     //     //console.log('resetExample',item);
            //     //     var exampleArr = item.split("\n"),afterExampleArr=[];
            //     //     for(var i= 0; i<exampleArr.length; i++){
            //     //         //console.log(',exampleArr[i].trim()====',exampleArr[i].trim().indexOf("*"));
            //     //         if(exampleArr[i].trim().indexOf('*/')< 0 && exampleArr[i].trim().indexOf("*")==0){
            //     //             exampleArr[i] = exampleArr[i].replace("*","");
            //     //         }
            //     //         afterExampleArr.push(exampleArr[i]);
            //     //     }
            //     //     afterExample = afterExampleArr.join("<br/>");
            //     //     //console.log("afterExample", afterExample);
            //     //
            //     // });
            //     // return afterExample;
            //     //console.log('resetMat==',resetMat);
            //     var comment = lines.join("\n");
            //     console.log('comment===',comment);
            //     console.log('commentParser(comment)===',commentParser(mat));
            //     return commentParser(comment);
            //     //afterContents.push(lines.join("\n"));
            //     //return afterContents;
            // });

            // 解析 /** @example  */格式
            var contents= commentParser(content.replace(/\/\*\*[\s\S]+?\*\//gm, function(mat) {
                //console.log('mat====',mat);
                var mats = mat.split("\n"), i = 1, line, indent = -1, lines = [mats[0]];
                while (i < mats.length - 1) {
                    line = mats[i];
                    //console.log('line====',line);
                    if (line.trim() != '*' && indent < 0) {
                        indent = line.match(/[^*\S]+/g).length;
                    }
                    // console.log('lineSplit0',line.trim().split("*")[0]);
                    // console.log('lineSplit1',line.trim().split("*")[1].trim().indexOf("@"));
                    if (indent > -1) {
                        console.log('beforeline===',line);
                        if(line.trim().split("*")[1].trim().indexOf("@") != 0){
                            line = line.substring(0, indent) + line.substring(indent).replace(/^[ ]+/g, function(mat) {
                                return mat.length + 'space'
                            })
                        }
                    }
                    lines.push(line);
                    i++;
                };
                lines.push(mats[i]);
                //console.log('content'+i,lines.join("\n"));
                // var beforeLines = lines.join("\n");
                // var afterExample;
                // //console.log('beforeLines==',beforeLines);
                // var resetMat = beforeLines.replace(/\@example[\s\S]+?((\*\/)|\@)/gm,function(item){
                //     //console.log('resetExample',item);
                //     var exampleArr = item.split("\n"),afterExampleArr=[];
                //     for(var i= 0; i<exampleArr.length; i++){
                //         //console.log(',exampleArr[i].trim()====',exampleArr[i].trim().indexOf("*"));
                //         if(exampleArr[i].trim().indexOf('*/')< 0 && exampleArr[i].trim().indexOf("*")==0){
                //             exampleArr[i] = exampleArr[i].replace("*","");
                //         }
                //         afterExampleArr.push(exampleArr[i]);
                //     }
                //     afterExample = afterExampleArr.join("<br/>");
                //     //console.log("afterExample", afterExample);
                //
                // });
                // return afterExample;
                //console.log('resetMat==',resetMat);
                afterContents.push(commentParser(lines.join("\n")));
                return lines.join("\n");


                //return afterContents;
            }));
            console.log('afterContents==',afterContents);
            console.log('contents2====',contents);
            //var contents = afterContents;
            // jsx 注释
            // var contents = commentParser(content.replace(/```[\s\S]+?```/gm, function(mat) {
            //     var mats = mat.split("\n"), i = 1, line, indent = -1, lines = [mats[0]]
            //     while (i < mats.length - 1) {
            //         line = mats[i]
            //         if (line.trim() != '*' && indent < 0) {
            //             indent = line.match(/[^*\S]+/g).length
            //         }
            //         if (indent > -1) {
            //             line = line.substring(0, indent) + line.substring(indent).replace(/^[ ]+/g, function(mat) {
            //                 return mat.length + 'space'
            //             })
            //         }
            //         lines.push(line)
            //         i++
            //     }
            //     lines.push(mats[i])
            //     return lines.join("\n")
            // }));

            return contents.filter(function(item) {
                return item.tags.every(function(tag) {
                    return tag.tag != 'skip';
                });
            });
        }), options, conf) : {};
    }
};
