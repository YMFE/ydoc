module.exports = {
    "destDir": "yo-docs",
    "template_scss":"./template/template_scss.html",
    "template_static":"./template/template_static.html",
    "project": {
        "title": "YO Document",
        "footer": "Made By Qunar Hotel FE Mobile Team. © 2014 - 2016",
        "banner": {
            "title": "Yo 简介",
            "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
        },
        "pages": [
            {
                "name": "index",
                "title": "起步",
                "type": "markdown",
                "banner": {
                    "title": "简介",
                    "description": "Yo 是一款基于 Mobile First 理念而设计的 CSS Framework，当然，你使用在PC高级浏览器中也完全没有问题；其具备轻量，易用，快速且高度强大的自定义能力。"
                },
                "content": "./README.md"
            },
            {
                "name": "changelog",
                "title": "历史",
                "type": "markdown",
                "content": "./changelog.md"
            },
            {
                "name": "api",
                "title": "起步",
                "type": "scss",
                "content": "./lib/**/*.scss"
            },
            {
                "name": "demo",
                "title": "Demo",
                "url": "http://ued.qunar.com/mobile/yo/demo/"
            }
        ]
    }
}