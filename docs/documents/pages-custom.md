# 自定义页面

YDoc 的页面可支持 .md、.jsx、.html 三种类型。我们推荐大部分的文档内容 __使用 markdown 编写__，少数个性化页面使用 html 或 jsx 实现。

### Markdown 规则
YDoc 会根据 markdown 内容获取网站标题和描述信息，如下所示，YDoc 会将当前页面标题设置为 “示例”， 页面描述信息设置为 “这是一个示例。”。

```markdown
# 示例
这是一个示例。

## 章节1

## 章节2

```

### Html 规则
YDoc 支持解析 .html 文件，你可以使用 html 所有特性高度自定义页面内容。

### JSX 规则

JSX 就是 Javascript 和 XML 结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。

Ydoc 使用了开源工具 [noox](https://github.com/suxiaoxin/noox)  解析 .jsx 文件，详细使用方法参考 [jsx](jsx.md)

