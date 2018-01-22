var fs = require('fs');
var sysPath = require('path');
var commentParser = require('comment-parser');

var btn = fs.readFileSync(sysPath.join(__dirname, './button.js'), 'UTF-8');

var res = commentParser(btn);

console.log(JSON.stringify(res, null, 2));