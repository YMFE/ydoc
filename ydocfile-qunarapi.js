var fs = require('fs');
var path = require('path');
var qunarapiconfig = [];
fs.readdirSync('./test-qunarapi/qunarapi/api').filter(function(fileName) {
    return fs.statSync('./test-qunarapi/qunarapi/api/' + fileName).isDirectory()
}).map(function(dir) {
    qunarapiconfig.push({ "name": dir.substring(2)});
    var itemArr = fs.readdirSync('./test-qunarapi/qunarapi/api/' + dir).filter(function(fileName) {
                return /.+\.md$/.test(fileName);
            }).map(function(file) {
                return {
                    "name": file.substring(2, file.length - 3),
                    sub: true,
                    content: './test-qunarapi/qunarapi/api/' + dir + '/' + file
                };
            });
    for(var i = 0; i< itemArr.length; i++){
        qunarapiconfig.push(itemArr[i]);
    }
});

module.exports = function() {
    return {
        "name": "QunarAPI Document",
        "dest": "./_docs-qunarApi/",
        "resources": {
            "source/images": './test-hytive/source/images/'
        },
        "common": {
            "title": "QunarAPI Document",
            "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2016<br /> Style Build By <a href='http://bootcss.com'>Bootstrap</a> ",
            "navbars": []
        },
        "pages": [{
            "name": 'qunarapi',
            "title": '简介',
            "banner": {
                "title": 'Qunar API 简介',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            content: './test-qunarapi/qunarapi/README.md'
        }, {
            "name": 'qunarapi-getting-started',
            "title": '快速开始',
            "banner": {
                "title": 'Qunar API 快速开始',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            content: './test-qunarapi/qunarapi/getstart.md'
        }, {
            "name": 'qunarapi-api',
            "title": 'API',
            "banner": {
                "title": 'Qunar API 详细API列表',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": qunarapiconfig
            }
        },{
            "name": 'qunarapi-errorcode',
            "title": '错误码',
            "banner": {
                "title": 'Qunar API 错误码',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": (fs.readdirSync('./test-qunarapi/qunarapi/errorCode').filter(function(fileName) {
                    return fs.statSync('./test-qunarapi/qunarapi/errorCode/' + fileName).isDirectory()
                }).map(function(dir) {
                    return {
                        "name": dir.substring(2),
                        modules: (fs.readdirSync('./test-qunarapi/qunarapi/errorCode/' + dir).filter(function(fileName) {
                            return /.+\.md$/.test(fileName);
                        }).map(function(file) {
                            return {
                                "name": file.substring(2, file.length - 3),
                                content: './test-qunarapi/qunarapi/errorCode/' + dir + '/' + file
                            };
                        }))
                    };
                }))
            }
        },{
            "name": 'qunarapi-appendix',
            "title": '附录',
            "banner": {
                "title": 'Qunar API 附录',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": [{
                    "name": 'normal导航栏选项',
                    content: './test-qunarapi/qunarapi/appendix/navibar-normal.md'
                }, {
                    "name": 'transparent导航栏选项',
                    content: './test-qunarapi/qunarapi/appendix/navibar-transparent.md'
                },{
                    "name": '微信JS-SDK',
                    content: './test-qunarapi/qunarapi/appendix/weichat.md'
                }]
            }
        }, {
            "name": 'qunarapi-tools',
            "title": '工具',
            "banner": {
                "title": 'Qunar API 工具',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": fs.readdirSync('./test-qunarapi/qunarapi/tools').filter(function(fileName) {
                    return /.+\.md$/.test(fileName);
                }).map(function(file) {
                    return {
                        "name": file.substring(2, file.length - 3),
                        content: './test-qunarapi/qunarapi/tools/' + file
                    };
                })
            }
        },{
            "name": 'qunarapi-Q&A',
            "title": '常见问题',
            "banner": {
                "title": 'Qunar API 常见问题',
                "description": '桥接native功能和浏览器的JavaScript API'
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "blocks": fs.readdirSync('./test-qunarapi/qunarapi/question').filter(function(fileName) {
                    return /.+\.md$/.test(fileName);
                }).map(function(file) {
                    return {
                        "name": file.substring(2, file.length - 3),
                        content: './test-qunarapi/qunarapi/question/' + file
                    };
                })
            }
        }]
    }
}
