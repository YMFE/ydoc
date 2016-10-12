var fs = require("fs");
var path = require("path");

module.exports = function() {
    return {
         "name": "Hytive Document",
         "dest": "./_docs-hytive/",
         "resources": {
             "source/images": './test-hytive/source/images/'
         },
         "common": {
             "title": "QunarAPI Document",
             "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2016<br /> Style Build By <a href='http://bootcss.com'>Bootstrap</a>",
             "navbars": []
         },
         "pages": [{
             "name": "index",
             "title": "简介",
             "banner": {
                 "title": "Hytive简介",
                 "description": "跨平台移动开发Hybrid解决方案"
             },
             "content":{
                 "type": "blocks",
                 "sidebar": true,
                 "blocks": [{
                     "name": "简介",
                     "content": "./test-hytive/hytive/README.md"
                 }, {
                     "name": "FAQ"
                 },{
                     "name": "iOS",
                     sub: true,
                     "content": "./test-hytive/hytive/FAQ/iOSFAQ.md",

                 }, {
                     "name": "Android",
                     sub: true,
                     "content": "./test-hytive/hytive/FAQ/androidFAQ.md"
                 }, {
                     "name": "FE",
                     sub: true,
                     "content": "./test-hytive/hytive/FAQ/feFAQ.md"
                 },
                 {
                     "name": "博客",
                     "content": "./test-hytive/hytive/blog.md"
                 }, {
                     "name": "wiki",
                     "content": "./test-hytive/hytive/wiki.md"
                 }]
             }
         }, {
             "name": "getting-started",
             "title": "快速开始",
             "banner": {
                 "title": "Hytive 快速开始",
                 "description": "跨平台移动开发Hybrid解决方案"
             },
             "content":{
                 "type": "blocks",
                 "sidebar": true,
                 "blocks": [{
                     "name": "概述",
                     "content": "./test-hytive/hytive/gettingstarted/overview.md"
                 }, {
                     "name": "准备工作",
                     "content": "./test-hytive/hytive/gettingstarted/prework.md"
                 }, {
                     "name": "第一个应用"
                 }, {
                     "name": "创建Android应用",
                     sub: true,
                     "content": "./test-hytive/hytive/gettingstarted/androidApp.md"
                 }, {
                     "name": "创建iOS应用",
                     sub: true,
                     "content": "./test-hytive/hytive/gettingstarted/iOSApp.md"
                 }]
            }
        }, {
             "name": "plugindev",
             "title": "插件开发",
             "banner": {
                 "title": "Hytive 插件开发",
                 "description": "插件是扩展 Hytive 的最佳方式，通过开发特定的插件，可以做出 HTML5 和 Native 完美结合的应用！"
             },
             "content": {
                 "type": "blocks",
                 "sidebar": true,
                 "blocks": [].concat({ "name": 'Android插件开发'}, fs.readdirSync('./test-hytive/hytive/plugin/android').filter(function(fileName) {
                             return /.+\.md$/.test(fileName);
                         }).map(function(file) {
                             return {
                                 name: file.substring(2, file.length - 3),
                                 sub: true,
                                 content: './test-hytive/hytive/plugin/android/' + file
                             };
                         }) ,{ "name": 'iOS插件开发' },fs.readdirSync('./test-hytive/hytive/plugin/iOS').filter(function(fileName) {
                             return /.+\.md$/.test(fileName);
                         }).map(function(file) {
                             return {
                                 name: file.substring(2, file.length - 3),
                                 sub: true,
                                 content: './test-hytive/hytive/plugin/iOS/' + file
                             };
                         }))
             }
         }, {
             "name": "project",
             "title": "实战项目",
             "banner": {
                 "title": "Hytive 实战项目",
                 "description": "跨平台移动开发Hybrid解决方案"
             },
             "content": {
                 "type": "blocks",
                 "sidebar": true,
                 blocks: fs.readdirSync("./test-hytive/hytive/project").filter(function(fileName) {
                     return /.+\.md$/.test(fileName);
                 }).map(function(file) {
                     return {
                         "name": file.substring(2, file.length - 3),
                         "content": "./test-hytive/hytive/project/" + file
                     };
                 })
             }

         }, {
             "name": "resource_update",
             "title": "资源包更新",
             "banner": {
                 "title": "Hytive 资源包更新",
                 "description": "跨平台移动开发Hybrid解决方案"
             },
             "content": {
                 "type": "blocks",
                 "sidebar": true,
                 blocks: fs.readdirSync("./test-hytive/hytive/resource_update").filter(function(fileName) {
                     return /.+\.md$/.test(fileName);
                 }).map(function(file) {
                     return {
                         "name": file.substring(2, file.length - 3),
                         "content": "./test-hytive/hytive/resource_update/" + file
                     };
                 })
             }
         }, {
             "name": "history",
             "title": "更新日志",
             "banner": {
                 "title": "Hytive 更新日志",
                 "description": "跨平台移动开发Hybrid解决方案"
             },
             "content": "./test-hytive/hytive/history.md"
         }]
     }
}
