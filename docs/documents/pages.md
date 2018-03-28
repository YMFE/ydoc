# 页面

## 目录
YDoc 使用 SUMMARY.md 文件生成一本书的目录，SUMMARY 文件包含了一本书的所有章节信息。

SUMMARY.md 由一组链接列表组成，将一个列表嵌套到父章节将创建子章节，简单示例如下：


```markdown
# 目录

### 章节 1

* [快速开始](start.md)
  * [安装](installation.md)
* [项目设置](setting.md)
  * [配置文件](config.md)
```

##### 锚点
目录中的章节可以使用锚点指向文件的特定部分。


```markdown
# 目录

### 章节 2

* [API](api.md)
  * [a](api.md#a)
  * [b](api.md#b)
```

##### 章节
目录可以分为多个部分，如下所示：
```markdown
# 目录

### 章节 1

* [快速开始](start.md)
  * [安装](installation.md)
* [项目设置](setting.md)
  * [配置文件](config.md)

### 章节 2

* [API](api.md)
  * [a](api.md#a)
  * [b](api.md#b)

```

## 页面
页面包含了首页，网站内容页面等，可支持 .md、.jsx、.html 三种类型。YDoc 推荐大部分的文档内容使用 markdown 编写，只有少数个性化页面使用 html 或 jsx 实现。

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
