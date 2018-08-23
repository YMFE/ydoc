# 快速开始

YDoc 是一个优雅的文档站构建工具，能够基于 markdown 轻松生成完整静态站点，让你专注于文档写作。YDoc 拥有灵活而强大的插件/主题机制，开发者可以轻松定制属于自己的文档站点。

## 安装依赖
### 安装 Node.js

YDoc 依赖 Node.js , 请安装不低于 7.6 版本的 Node.js

### 安装 Node.js

方案一: 从 [Node.js](https://nodejs.org/en/) 官网下载安装包

方案二: 使用 [Node Version Manager(NVM)](https://github.com/creationix/nvm) 安装 Node.js，你可以通过以下命令安装 NVM :

cURL:
``` bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

Wget:
``` bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

NVM 安装好以后，重启终端并运行以下命令来安装 Node.js :

``` bash
nvm install stable
```

### 使用 NPM 安装 YDoc

```
npm install ydoc [-g]
```

### 使用 NPM 安装 rc 版本（发布候选版本）

``` bash
npm install ydoc@rc [-g]
```

## 创建你的站点

``` bash
mkdir project && cd project
ydoc init
ydoc build
```

`ydoc init` 执行初始化操作，这将会在当前目录生成一个 `'docs'` 目录，用于存放文档(markdown)文件。

`ydoc build` 执行构建操作，这将会使用 `'docs'` 目录中的文件进行文档站的构建，构建成功后会在当前目录生成一个 `'_site'` 目录，打开 `'_site'` 目录中的  `index.html` 文件即可访问构建的文档站首页 🎉🎉

-------------------

## 下一步我可以做什么

简单学习即可轻松使用下面的基本功能，这不会花费你很长时间：

- [目录](structure.md): 了解 YDoc 的目录结构
- [导航](nav.md): 页面顶部的链接
- [页面](pages-index.md): 编写首页、文档页目录和内容