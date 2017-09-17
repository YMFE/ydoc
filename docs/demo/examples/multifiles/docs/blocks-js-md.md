## 效果
在同一页面中使用多个文件生成本页面。

### 关键配置
`intro` 页面介绍。

`content.blocks` 单页多模块配置。

配置文件：
```
"intro": "./docs/blocks-js-md.md",
"content": {
    "blocks": [{
        "name": "简介", // 标题
        "content": "./docs/markdown/md1.md" // 内容
    }, {
        "name": "Hybrid" // 只有标题，做目录和分割用
    }, {
        "name": "说明",
        "sub": true, // 标题在目录里已子目录形式显示
        "content": "./docs/markdown/md2.md"
    }]
}
```
