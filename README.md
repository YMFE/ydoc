<div style="text-align: center; padding: 24px;">
  <img src="https://ws1.sinaimg.cn/large/006FkmqZly1fpswv9gzalj305e05ft98.jpg" width="200" alt="logo" srcSet="https://ws1.sinaimg.cn/large/006FkmqZly1fpswvk5qsyj30as0au75x.jpg 2x" />
</div>



## YDoc

[![npm version](https://badge.fury.io/js/ydoc.svg)](https://badge.fury.io/js/ydoc)

YDoc 是一个优雅的文档站构建工具，能够基于 markdown 轻松生成完整静态站点，让你专注于文档写作。YDoc 拥有灵活而强大的插件 / 主题机制，开发者可以轻松定制属于自己的文档站点。

- [文档首页](https://ydoc.ymfe.org/)

## 用法

### 安装
```
npm install -g ydoc
```

## 创建站点
```
ydoc init
ydoc build
```

## 插件

- [ydoc-plugin-copy](https://www.npmjs.com/package/ydoc-plugin-copy): '用于快速复制 markdown 生成页面的代码片段。'
- [ydoc-plugin-import-asset](https://www.npmjs.com/package/ydoc-plugin-import-asset): '在页面中引入 js 与 css 文件
- [ydoc-plugin-jsdoc](https://www.npmjs.com/package/ydoc-plugin-jsdoc): '根据代码注释生成文档，基于 jsdoc'
- [ydoc-plugin-pangu](https://www.npmjs.com/package/ydoc-plugin-pangu): '自动替你在网页中所有的中文字和半形的英文、数字、符号之间插入空白(盘古之白)'
- [more... ](https://ydoc.ymfe.org/plugin/index.html)

## 开发者

- 董文博 <wenbo.dong@qunar.com>
- 苏文雄 <wenxiong.su@qunar.com>

我们非常欢迎社区的同学参与开发，欢迎提 [pull requests](https://github.com/YMFE/ydoc/pulls) 来帮助我们完善程序，也欢迎社区的同学为 YDoc 开发[插件](https://ydoc.ymfe.org/plugin/index.html)。

同时也欢迎大家对 YDoc 提出宝贵的意见或建议：[github issues](https://github.com/YMFE/ydoc/issues)