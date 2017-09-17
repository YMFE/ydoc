## 首页配置说明

### 效果
如上。

### 关键配置

`pages` 某个页面中配置 `homepage`和`content`，其中`content`是markdown文件，首页正文部分是基于markdown解析的DOM结构。

`version` 版本信息。

`button` 按钮，是一个数组，可添加多个按钮。

`intro` 正文介绍，是一个数组，可添加多个正文块，顺序可自由组合。

```
"homepage": {
    "version": "v3.1.0",
    "button": [{
        "name": "&nbsp;&nbsp;起步&nbsp;&nbsp;",
        "href": "https://ydoc.ymfe.org/start.html"
    },{
        "name": "Github",
        "href": "https://github.com/YMFE/ydoc"
    }],
    "intro": [{
        "title": "为前端开发者设计的文档生成工具",
        "desc": "YDoc让文档开发更简单高效，让开发者专注于程序本身，让项目代码更具可读性、可维护性。"
    },{
        "title": "特性",
        "detail": {
            "type": "thumbnail",
            "content": [{
                "name": "丰富、可扩展的API",
                "src": "http://ojk406wln.bkt.clouddn.com/intro_muti.png",
                "desc": "YDoc提供了非常详尽的API，扩展性较强，如果你希望添加某些功能，可以在<a href=\"https://github.com/YMFE/ydoc\" target=\"_blank\"> Github </a>上面提Issue。"
            },{
                "name": "基于注释/markdown",
                "src": "http://ojk406wln.bkt.clouddn.com/intro_md.png",
                "desc": "基于项目代码注释与markdown快速构建文档，二者亦可在同一页面中使用。"
            },{
                "name": "可配置主题",
                "src": "http://ojk406wln.bkt.clouddn.com/intro_theme.png",
                "desc": "官方提供多套主题，并且支持用户自定义开发主题。"
            }]
        }
    },{
        "title": "多个文本块可自由组合",
        "desc": "文本块描述。"
    }]
},
"content": "./README.md" // 内容(基于markdown解析出首页正文的DOM结构)
```
