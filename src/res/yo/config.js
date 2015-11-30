module.exports = {
    "title": "YO Document",
    "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2015<br /> Style Build By <a href='http://bootcss.com'>Bootstrap</a>",
    "destDir": "yo-docs",
    "staticTemplate": "template/static.html",
    "defaultTemplate": "template/template.html",
    "webSiteUrl": "http://ued.qunar.com/mobile/yo/doc/",
    "pages": [{
        "name": "index",
        "title": "简介",
        "banner": {
            "title": "Yo 简介",
            "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
        },
        "content": "./README.md"
    }, {
        "name": "api",
        "title": "API",
        "banner": {
            "title": "Yo API",
            "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
        },
        "blocks": [{
            "type": "scss",
            "content": "./lib/"
        }]
    }, {
        "name": "changelog",
        "title": "历史",
        "banner": {
            "title": "Yo 历史",
            "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
        },
        "content": "./changelog.md"
    }]
}