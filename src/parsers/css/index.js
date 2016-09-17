var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var artTemplate = require('art-template');

var analyseComment = require('../../utils/analyseComment.js');

var pageTPL = fs.readFileSync(sysPath.join(__dirname, './page.html'), 'UTF-8');

module.exports = {
    type: "css",
    hightlight: "sass",
    extNames: ['.css', '.scss', '.sass'],
    parser: function(contents, options, conf) {
        var groupList = [],
            groups = {},
            sidebars = [],
            rs;
        contents.forEach(function(content, index) {
            //var commentList = commentParser(content);
            var commentList = commentParser(content.replace(/\/\*\*[\s\S]+?\*\//gm, function(mat){
              var mats = mat.split("\n"), i = 1, line, indent = -1, lines = [mats[0]]
              while (i < mats.length - 1) {
                  line = mats[i]
                  if (line.trim() != '*' && indent < 0) {
                      indent = line.match(/[^*\S]+/g).length
                  }
                  if (indent > -1) {
                      line = line.substring(0, indent) + line.substring(indent).replace(/^[ ]+/g, function(mat) {
                          return mat.length + 'space'
                      });
                  }
                  console.log('line',line);
                  lines.push(line);
                  i++;
              }

              lines.push(mats[i]);
              return lines.join("\n");
          }));

            commentList.forEach(function(item) {
                var ret = analyseComment(item, options.files[index].substring(1), conf)
                ret.group = ret.class || ret.module;
                ret.name = ret.function || ret.method;
                ret.description = ret.description || ret._desc;
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
            linkSource: options.source,
            list: groupList.map(function(group) {
                // console.log('group=======', group);
                // console.log('tag=======', "#"+group);
                sidebars.push({
                    name: group,
                    tag: group && "#"+group
                });
                return {
                    name: group,
                    list: groups[group].filter(function(item) {
                        if (!item.skip) {
                            sidebars.push({
                                name: item.name,
                                sub: true
                            });
                            return true;
                        }
                        return false;
                    })
                };
            })
        };

        return {
            type: 'html',
            sidebars: sidebars,
            content: artTemplate.compile(pageTPL)(rs)
        };
    }
};
