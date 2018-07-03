# markdown 扩展
YDoc 使用了开源工具 [markdown-it](https://github.com/markdown-it/markdown-it) 解析 markdown，可以使用 markdown-it 已有的插件或开发新的插件定制功能，具体可参考 markdown-it 开发文档。

### YDoc 配置 markdown-it 插件

在 ydoc.js 配置文件增加 markdownIt 配置项
```js
{
  markdownIt: function() {
    md.use(plugin1)
    .use(plugin2, opts, ...)
    .use(plugin3);
  }
}
```