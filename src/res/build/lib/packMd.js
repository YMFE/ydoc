/**
 * Created by eva on 15/10/13.
 */
/**
 * Created by eva on 15/10/13.
 */
var gulp = require('gulp');
var fs = require('fs');
var through = require('through-gulp');
var path  = require('path');
var utils = require('../../../utils.js');
var BASEPATH = process.cwd();
var config = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));


function packMd(){
    var stream = through(function(file, enc, callback){        
        var html = file.contents.toString();
        var fileName = path.basename(file.path, '.html')
        var currentItem ={};
        config.project.pages.forEach(function(item){
            if(item.content.indexOf(fileName) >= 0){
                currentItem = item;
            }
        });
        var data = {
            page: {
                type: 'html',
                title: currentItem.title,
                name: currentItem.name,
                content: html,
                sidebar: currentItem.sidebar || [],
                menu: config.project.pages
            },
            title: 'Kami',
            footer: 'Kami',
            banner: {
                title: 'Kami',
                description: '为移动而生的组件库'
            },
            menus: config.project.pages
        };

        file.contents = new Buffer(JSON.stringify(data));
        this.push(file);
        // console.log(this);
        callback();
    });
    return stream;
}
module.exports = packMd;