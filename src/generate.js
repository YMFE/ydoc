const path = require('path');
const fs = require('fs-extra');
const batch = [];
const utils = require('./utils');
const output = require('./output.js');

function insertToBatch(transaction){
  batch.push(transaction);
}

exports.runBatch = function runBatch(){
  if(batch.length === 0) return;
  let transaction = batch.shift();
  transaction.run();
  runBatch();
}

exports.generatePage = function generatePage(bookpath){
  let prevPage = null;  
  const batch = [];

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
    context.title = page.title === page.title ? page.title : page.title + '-' + context.title
    page.absolutePath = path.resolve(bookpath, page.releativePath);
    insertToBatch({
      run: output(page, context)
    })
    
  };

}

