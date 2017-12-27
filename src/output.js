const fs = require('fs-extra');
const utils = require('./utils');

module.exports = function(page, context){
  return ()=> {
    fs.writeFileSync(page.absolutePath, JSON.stringify(context, null, 2));
    utils.log.debug('Generate file: ' + page.absolutePath)
  }  
}