const fs = require('fs-extra');
const utils = require('./utils');
const theme = require('../theme/Component');

module.exports = function(page, context){
  return ()=> {
    // console.log(context);
    // throw new Error('err')
    fs.writeFileSync(page.absolutePath, theme(context));
    utils.log.debug('Generate file: ' + page.absolutePath)
  }  
}