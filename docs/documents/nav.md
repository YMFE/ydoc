# 网站导航
在 NAV.md 文件可配置网站的导航标题、logo、菜单列表信息，简单示例如下：

```markdown
# YDoc
![logo](ydoc/images/logo.png)

* [文档](/documents/index.md)
* [文档规范](/style-guide/index.md)
* [插件](/plugins/index.md)
```

上面的 markdown 内容可生成如下导航信息：

```
标题：YDoc
Logo：ydoc/images/logo.png
菜单： 文档 文档规范 插件
```

## 二级导航

YDoc 支持二级导航，如下示例，二级导航在需要在原有的导航上面添加二级标题，即可生成二级导航。

```markdown
# YDoc
![logo](ydoc/images/logo.png)

## 文档
* [教程](/documents/index.md)
* [规范](/style-guide/index.md)

```

## 既有二级导航，又有一级导航
可通过 `---` 分区

```markdown

# YDoc
![logo](ydoc/images/logo.png)

## 文档
* [教程](/documents/index.md)
* [规范](/style-guide/index.md))
---
* [插件](/plugins/index.md)

```
