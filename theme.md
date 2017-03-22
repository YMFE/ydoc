## 安装

从 `3.0.0` 版本开始支持，包括 `prerelease` 版本。

### 下载
从 NPM 中安装

> npm install ydoc-theme-[name] --save

### 配置
在config文件里添加配置，如果不配置此项，则为默认主题。

```json
{
    "theme": "library",
    ...
}
```

## 主题介绍

### 默认主题

简洁高效，匠心独运。

去除冗余的设计元素，直达目标，极致简约。

![](http://ojk406wln.bkt.clouddn.com/ydoc-default.png)

### library

————你见过凌晨四点图书馆的灯光吗？

————我见过，那时我正在debug。。

![](http://ojk406wln.bkt.clouddn.com/ydoc-library.png)

### ocean

海洋——浩瀚无边，求索——永无止境。

沉默之中亦有波澜，这是每个程序员内心深处的情愫。

![](http://ojk406wln.bkt.clouddn.com/ydoc-ocean.png)

### travel

背上行囊，忘记烦恼，

在清晨的阳光中，踏上一次探索的旅行。

![](http://ojk406wln.bkt.clouddn.com/ydoc-travel.png)

## 开发主题
每一个插件都是一个 npm 模块，命名规则为 `ydoc-theme-<name>`，比如 `ydoc-theme-ocean`。
最简单的方法是 fork 一份 `ydoc-theme-default`，根据自己的设计在文件中修改或添加内容。

<h3 style="font-weight: normal"> 配置 </h3>
修改或新建 `ydoc-theme-<name>` 目录中的 `theme.config` 文件。
```json
{
    "css": ["./default.css"],
    "js": ["./default.js"]
}
```
<h3 style="font-weight: normal"> 自定义主题 </h3>
在目录下新建或修改default.css、default.js即可开发主题。
主题中的文件会被引入到页面中，配置的优先级关系是 `插件(insertCSS/insertJS)配置 > 主题配置 > ydoc基础配置`

<h3 style="font-weight: normal"> 发布 </h3>
编辑 package.json 中的模块名称、版本号等信息，执行 npm publish 即可。
