
# 文档页

YDoc 借鉴了 Gitbook 中 `"书"` 的概念：

- YDoc 的每个导航项都是不同的 `"书"`
- 每本 `"书"` 都是由目录和页面组成
- YDoc 文档站就是由若干本书及其他页面组成的网站

使用 SUMMARY.md 文件生成一本书的目录，SUMMARY 文件包含了一本书的所有章节信息，具体的文档页面一般是若干 markdown 文件，如果你不知道  markdown 是什么，可以查看本文档中 [markdown 的介绍](/documents/markdown.html)

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
  * [a](api.md#anchor1)
  * [b](api.md#anchor2)
```

##### 章节
目录可以分为多个部分，如下所示：
``` markdown
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