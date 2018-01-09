const utils = require('../utils.js');
const fs =require('fs');
let id = 1;

module.exports = function(jsxPath, props){
  let jsxContent = fs.readFileSync(jsxPath, 'utf8');
  let componentName = 'Customer_Component_' + id++;
  utils.noox.add(componentName, jsxContent);
  return utils.noox.render(componentName, props);
}

