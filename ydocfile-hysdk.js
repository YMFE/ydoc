module.exports = function(){
    return {
        "name": "HySDK",
        "dest": "./_docs-hysdk/",
        "common": {
            "title": "HySDK Documentation",
            "footer": "Made By YMFE TEAM. © 2014 - 2016",
            "home": "YMFE",
            "homeUrl": "http://ymfe.tech/",
            "navbars": []
        },
        "options": {
            "markdown": {
                "menuLevel": 2
            }
        },
        "pages": [{
            "name": "hysdk-getting-started",
            "title": "快速开始",
            "banner": {
                "title": "快速开始",
                "description": ""
            },
            "content": "./test-hysdk/README.md"
        },
        {
            "name": "hysdk-api",
            "title": "API",
            "banner": {
                "title": "API",
                "description": ""
            },
            "content": {
                "type": "blocks",
                "sidebar": true,
                "multi": true,
                "index": "./test-hysdk/api.md",
                "pages": [{
                    "name": "滚动和列表"
                }, {
                    "name": "List",
                    "content": "./test-hysdk/src/apis/base.js",
                    "sub": true
                }]
            }
        }]
    };
};
