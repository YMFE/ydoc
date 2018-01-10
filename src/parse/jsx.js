const utils = require('../utils.js');
const fs =require('fs');
let id = 1;

module.exports = function(jsxPath){
  let jsxContent = fs.readFileSync(jsxPath, 'utf8');
  let componentName = 'Customer_Component_' + id++;

  return {
    data: utils.noox.add(componentName, jsxContent).data,
    render: (props) => utils.noox.render(componentName, props) 
  }
}

