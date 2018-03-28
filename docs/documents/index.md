# 快速开始

YDoc 是一个优雅的文档站构建工具，能够基于 markdown 轻松生成完整静态站点，让你专注于文档写作。YDoc 拥有灵活而强大的插件/主题机制，开发者可以轻松定制属于自己的文档站点。

## 快速开始

### 安装

```
npm install ydoc [-g]
```

## 创建你的站点

```
mkdir project && cd project
ydoc init
ydoc build
```

`ydoc init` 执行初始化操作，这将会在当前目录生成一个 `'docs'` 目录，用于存放文档(markdown)文件。

`ydoc build` 执行构建操作，这将会使用 `'docs'` 目录中的文件进行文档站的构建，构建成功后会在当前目录生成一个 `'_site'` 目录，打开 `'_site'` 目录中的  `index.html` 文件即可访问构建的文档站首页 🎉🎉