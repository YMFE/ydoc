var fs = require('fs');

module.exports = function() {
    return {
        "name": "KAMI",
        "options": {
            "js": {
                "lib": "js",
                "source": false,
                "format": true
            }
        },
        "common": {
            "title": "KAMI",
            "footer": "Made By Qunar YMFE TEAM. © 2014 - 2016",
            "navbars": []
            // "home": "QApp",
            //"homeUrl": "http://ued.qunar.com/mobile/",
            // "navbars": [{
            //     "name": "QApp",
            //     "url": "http://ued.qunar.com/mobile/qapp/doc/"
            // }, {
            //     "name": "Kami",
            //     "url": "http://ued.qunar.com/mobile/kami/doc/"
            // }, {
            //     "name": "Yo",
            //     "url": "http://ued.qunar.com/mobile/yo/doc/"
            // }, {
            //     "name": "QunarAPI",
            //     "url": "http://hy.qunar.com/docs/qunarapi-api.html"
            // }, {
            //     "name": "QMB2",
            //     "url": "http://ued.qunar.com/mobile/qmb2/",
            //     "target": "_blank"
            // }, {
            //     "name": "Statistics",
            //     "url": "http://ued.qunar.com/mobile/statistics/"
            // }, {
            //     "name": "Blog",
            //     "url": "http://ued.qunar.com/mobile/blog/",
            //     "target": "_blank"
            // }, {
            //     "name": "Hytive",
            //     "url": "http://hy.qunar.com/docs/index.html"
            // }]
        },
        "pages": [{
            "name": "index",
            "title": "简介",
            "content": "./test-kami/document/startup.md"
        }, {
            "name": "组件API",
            "title": "组件API",
            "content": "./test-kami/kami/scripts/**/*.js",
            "ignore": ['./test-kami/kami/scripts/**/index.js'],
            "compile": "js"
            // "options": {
            //     "type": "lib",
            //     "categories": ['Base', 'View', 'Class:View', 'Event:View', 'Router', 'Util-Dom', 'Util-Fn', 'Sniff', 'Plugin', 'Widget']
            // }
            // "content": "./test-qapp/testsrc/core/viewManager.js",
            // //"ignore": ['./test-qapp/testsrc/qapp.js', './test-qapp/testsrc/qapp-dev.js', './test-qapp/testsrc/qapp.min.js'],
            // "compile": "js",
            // "options": {
            //     "type": "lib",
            //     "categories": [ 'View', 'Class:View', 'Event:View']
            // }
        }]
    };
};
