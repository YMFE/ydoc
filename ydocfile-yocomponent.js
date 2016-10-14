var fs = require('fs');

module.exports = function() {
    return {
      "name": "Yo",
      "dest": "./_docs-yocomponet",
      "examplePath": "./test-yocomponent/demo/component",
      "common": {
        "title": "Yo Documentation",
        "footer": "Made By Doyoe.com © 2014 - 2016",
        "home": "Yo",
        "homeUrl": "",
        "navbars": []
      },
      "pages": [
        {
          "name": "index",
          "title": "Yo",
          "banner": {
            "title": "Yo",
            "description": "Yo 是基于 Mobile First 的策略而设计，并使用 Sass 开发的 CSS Framework，具备轻量，易用，可配置，强扩展等特性，同时也适应于PC端的高级浏览器",
            "download": "下载 Yo",
            "version": "v2.1.3"
          },
          "content": "./test-yocomponent/case.md"
        },
        {
          "name": "getting-started",
          "title": "起步",
          "banner": {
            "title": "起步",
            "description": "本文详细描述 Yo 的使用方式，花上几分钟，下述的介绍将会帮助你快速的上手，并让自己沉浸在使用 Yo 的开发之中，感受到乐趣"
          },
          "content": "./test-yocomponent/README.md"
        },
        {
          "name": "core",
          "title": "核心",
          "banner": {
            "title": "核心",
            "description": "详细介绍 Yo 的内置扩展函数和扩展方法"
          },
          "content": "./test-yocomponent/style/lib/core/*.scss",
          "compile": "css",
          "options": {
            "source": true
          }
        },
        {
          "name": "element",
          "title": "元件",
          "banner": {
            "title": "元件",
            "description": "详细介绍 Yo 的元件"
          },
          "content": "./test-yocomponent/style/lib/+(element|fragment|layout|widget)/*.scss",
          "compile": "css",
          "options": {
            "source": true
          }
        },
        {
          "name": "component",
          "title": "组件",
          "banner": {
            "title": "组件",
            "description": "组件的说明文档"
          },
          "content": {
            "type": "blocks",
            "sidebar": true,
            "multi": true,
            "index": "./test-yocomponent/case.md",
            "pages": [
              {
                "name": "List",
                "content": "./test-yocomponent/component_dev/list/src/index.js"
              }, {
                "name": "Range",
                "content": "./test-yocomponent/component_dev/range/src/index.js"
              }, {
                "name": "SwipeMenuList",
                "content": "./test-yocomponent/component_dev/swipeMenuList/src/index.js"
              }, {
                "name": "Scroller",
                "content": "./test-yocomponent/component_dev/scroller/src/index.js"
              }, {
                "name": "Grouplist",
                "content": "./test-yocomponent/component_dev/grouplist/src/index.js"
              }, {
                "name": "Rating",
                "content": "./test-yocomponent/component_dev/rating/src/index.js"
              }, {
                "name": "Calendar",
                "content": "./test-yocomponent/component_dev/calendar/src/index.js"
              }, {
                "name": "SwipeMenu",
                "content": "./test-yocomponent/component_dev/swipeMenu/src/index.js"
              }, {
                "name": "Alert",
                "content": "./test-yocomponent/component_dev/alert/src/index.js"
              }, {
                "name": "Confirm",
                "content": "./test-yocomponent/component_dev/confirm/src/index.js"
              }, {
                "name": "Dialog",
                "content": "./test-yocomponent/component_dev/dialog/src/index.js"
              }, {
                "name": "Number",
                "content": "./test-yocomponent/component_dev/number/src/index.js"
              }, {
                "name": "Popup",
                "content": "./test-yocomponent/component_dev/popup/src/index.js"
              }, {
                "name": "Tooltip",
                "content": "./test-yocomponent/component_dev/tooltip/src/index.js"
              }, {
                "name": "DateTimePicker",
                "content": "./test-yocomponent/component_dev/datetimepicker/src/index.js"
              }, {
                "name": "Tab",
                "content": "./test-yocomponent/component_dev/tab/src/index.js"
              }, {
                "name": "Loading",
                "content": "./test-yocomponent/component_dev/loading/src/index.js"
              }
            ]
          }
        },
        {
          "name": "animate",
          "title": "动画",
          "banner": {
            "title": "动画",
            "description": "详细介绍 Yo 的动画"
          },
          "content": "./test-yocomponent/style/lib/ani/*.scss",
          "compile": "css",
          "options": {
            "source": true
          }
        },
        {
          "name": "changelog",
          "title": "版本",
          "banner": {
            "title": "版本",
            "description": "Yo 的历史版本发布时间及变更记录，帮助你追溯到每个版本的演进过程，同时也有每个版本所对应的下载地址"
          },
          "content": "./test-yocomponent/changelog.md"
        },
        {
          "name": "demo",
          "title": "示例",
          "url": "http://doyoe.github.io/Yo/demo/"
        },
        {
          "name": "github",
          "title": "Github",
          "url": "https://github.com/doyoe/Yo"
        }
      ]
    }
}
