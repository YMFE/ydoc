module.exports = {
    "destDir": "yo-docs",
    "webSiteUrl": "http://ued.qunar.com/mobile/yo/doc/",
    "template_js":"./template/template_js.html",
    "template_scss":"./template/template_scss.html",
    "template_static":"./template/template_static.html",
    "project": {
        "title": "YO Document",
        "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2015<br /> Style Build By <a href='http://bootcss.com'>Bootstrap</a>",
        "banner": {
            "title": "Yo 简介",
            "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
        },
        "pages": [
            {
                "name": "QUICK START",
                "title": "QUICK START",
                "type": "markdown",
                "block": [{
                    "name": "Getting Started",
                    "content": "./docs/GettingStarted.md"
                }, {
                    "name": "Android Setup",
                    "content": "./docs/DevelopmentSetupAndroid.md"
                }]
            },{
                "name": "GUIDES",
                "title": "GUIDES",
                "type": "markdown",
                "block": [{
                    "name": "Style",
                    "content": "./docs/GettingStarted.md"
                }, {
                    "name": "Getting Started",
                    "content": "./docs/GettingStarted.md"
                }]
            }
        ]
    },
    "version": "0.0.1"
}