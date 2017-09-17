## 效果
在同一页面中使用多个文件生成本页面。

### 关键配置
`content.multi` 多页配置。

`content.index` 首页配置。

`content.pages` 每页配置。

`content.pages[*].sub` 配置为目录子项。

配置文件：
```
"content": {
    "sidebar": true,
    "multi": true,
    "index": "./docs/blocks-js-intro.md",
    "pages": [{
        "name": "Touchable",
        "content": "./component/touch.js"
    },{
        "name": "滚动"
    },{
        "name": "ScrollView1",
        "content": "./component/scroll1.js",
        "sub": true
    },{
        "name": "ScrollView2",
        "content": "./component/scroll2.js",
        "sub": true
    },{
        "name": "Alert",
        "content": "./component/alert.js"
    }]
}
```
