var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');
var shell = require('shelljs');



function getName(type, file) {
  var btn = fs.readFileSync(sysPath.join(__dirname, file), 'UTF-8');
  var commetObj = commentParser(btn);
  var reg = new RegExp('@' + type, 'gi');
  var name = '';
  // console.log(JSON.stringify(commetObj, null, 2));
  commetObj.forEach(function (item) {
    if (reg.test(item.source)) {
      item.tags.forEach(function (tagName) {
        if (tagName.tag === 'component') {
          name = tagName.name;
        }
      });
    }
  });
  return name;
}


shell.ls('test/jsdoc-to-markdown/Button.js').forEach(function (file) {
  // console.log(file);
  var name = getName('component', file);
  // console.log(name);
  // 为属性添加 memberof
  shell.sed('-i', /(.*)(@property.*)/gi, '$1$2\n$1@memberof ' + name, file);
  // component 修改为 class
  shell.sed('-i', /(\*[\s\S]+?@)(component)/gi, '$1class', file);
});
