const path = require('path');
const output = require('./output.js');
const batch = [];

function insertToBatch(transaction){
  batch.push(transaction);
}

exports.runBatch = function runBatch(){
  if(batch.length === 0) return;
  let transaction = batch.shift();
  transaction.run();
  runBatch();
}

// exports.generateSiteIndex = function generateSiteIndex(sitepath){
//   return function _generateSiteIndex(releativePath, context){
//     insertToBatch({
//       run: output({}, context)
//     })
//   }
// }

exports.generatePage = function generatePage(bookpath){
  let prevPage = null;  
  
  return function _generatePage(releativePath, context){
    const page = context.page;
    page.releativePath = releativePath;
    page.next = null;
    if(prevPage === null){
      page.prev = null;      
    }else{
      page.prev = prevPage.releativePath;
      prevPage.next = releativePath;
    }
    prevPage = page;
    if(page.title){
      context.title = page.title === context.title ? page.title : page.title + '-' + context.title
    }
    
    page.absolutePath = path.resolve(bookpath, page.releativePath);
    insertToBatch({
      run: output(page, context)
    })
    
  };

}

