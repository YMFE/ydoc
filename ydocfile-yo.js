module.exports = function() {
    return {
	    "name": "Yo",
        "dest": "./_docs-yo/",
	    "common": {
	        "title": "Yo Documentation",
            "footer": "© 2016 <a href=\"http://gitlab.corp.qunar.com/mfe/qdoc\">YMFE</a> Team. Build by <a href=\"https://github.com/YMFE/ydoc\">ydoc</a>.",
            "home": "YMFE",
            "homeUrl": "http://ued.qunar.com/ymfe/",
            "navbars": []
	    },
	    "pages": [{
	        "name": "index",
	        "title": "Yo",
	        "banner": {
	            "title": "Yo",
	            "description": "Yo 是基于 Mobile First 的策略而设计，并使用 Sass 开发的 CSS Framework，具备轻量，易用，可配置，强扩展等特性，同时也适应于PC端的高级浏览器",
	            "download": "下载 Yo",
	            "version": "v2.1.3"
	        },
	        "content": "./test-yo/case.md"
	    }, {
	        "name": "getting-started",
	        "title": "起步",
	        "banner": {
	            "title": "起步",
	            "description": "本文详细描述 Yo 的使用方式，花上几分钟，下述的介绍将会帮助你快速的上手，并让自己沉浸在使用 Yo 的开发之中，感受到乐趣"
	        },
	        "content": "./test-yo/README.md"
	    }, {
	        "name": "core",
	        "title": "核心",
	        "banner": {
	            "title": "核心",
	            "description": "详细介绍 Yo 的内置扩展函数和扩展方法"
	        },
	        "content": "./test-yo/style/lib/core/*.scss",
	        "compile": "css",
	        "options": {
	            "source": true
	        }
	    }, {
	        "name": "element",
	        "title": "元件",
	        "banner": {
	            "title": "元件",
	            "description": "详细介绍 Yo 的元件"
	        },
	        "content": "./test-yo/style/lib/+(element|fragment|layout|widget)/*.scss",
	        "compile": "css",
	        "options": {
	            "source": true
	        }
	    }, {
	        "name": "animate",
	        "title": "动画",
	        "banner": {
	            "title": "动画",
	            "description": "详细介绍 Yo 的动画"
	        },
	        "content": "./test-yo/style/lib/ani/*.scss",
	        "compile": "css",
	        "options": {
	            "source": true
	        }
	    }, {
	        "name": "changelog",
	        "title": "版本",
	        "banner": {
	            "title": "版本",
	            "description": "Yo 的历史版本发布时间及变更记录，帮助你追溯到每个版本的演进过程，同时也有每个版本所对应的下载地址"
	        },
	        "content": "./test-yo/changelog.md"
	    }, {
	        "name": "demo",
	        "title": "示例",
	        "url": "http://doyoe.github.io/Yo/demo/"
	    }, {
	        "name": "github",
	        "title": "Github",
	        "url": "https://github.com/doyoe/Yo"
	    }]
	}
}
