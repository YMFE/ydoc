/**
 * Created by eva on 15/10/13.
 */
/**
 * Created by eva on 15/10/13.
 */
var gulp = require('gulp');
var fs = require('fs');
var through = require('through-gulp');
var config = require('../config.js');
var path  = require('path');

function packMd(){
    var stream = through(function(file, enc, callback){
        var html = file.contents.toString();
        var fileName = path.basename(file.path, '.html')
        var currentItem ={};
        config.menu.forEach(function(item){
            if(item.name === fileName){
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
                menu: config.menu
            },
            title: 'Kami',
            footer: 'Kami',
            banner: {
                title: 'Kami',
                description: '为移动而生的组件库'
            },
            menus: config.menu
        };

        file.contents = new Buffer(JSON.stringify(data));
        this.push(file);
        // console.log(this);
        callback();
    });
    return stream;
}
module.exports = packMd;