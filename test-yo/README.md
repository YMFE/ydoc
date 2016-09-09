# Yo

**master 分支为 Yo v3.0.0 开发版本**

`Yo` 是基于 `Mobile First` 的策略而设计，并使用 `Sass` 开发的 `CSS Framework`，具备轻量，易用，可配置，强扩展等特性，同时也适应于PC端的高级浏览器。

在使用之前，请先确保你的机器有能够编译 `Sass` 的环境并开始去了解一些 [Sass](http://sass-lang.com/) 相关的知识（当然，这非常简单）。

与其它框架不同的是，实际上我们并不计划对外提供打包好的 `yo.min.css` 来供使用，而是推荐直接在 `Yo` 的 `usage` 目录下进行开发。这样你将能体会到 `Yo` 的众多功能和方法为开发所带来的便利，并感受到它的魅力。

好了，请仔细看下面的步骤，这可以帮你快速搞定一切：


## 内容

* [环境搭建](#quick-stat)
* [如何开始](#how-to-start)
* [浏览器支持](#supported-browsers)
* [工程约束](#rules)
* [示例代码](#template)
* [注意](#attention)
* [文档和实例](#documentation-and-demo)
* [版本](#versioning)
* [问题及反馈](#bugs-and-feature-requests)
* [作者](#author)
* [版权和许可](#copyright-and-license)


<a name="quick-stat"></a>
## 环境搭建

### 基础环境

请确保你已经安装过下述环境：

* Bower
* Node.js
* npm

### 使用gulp构建

* 安装: `bower install yo`
* 安装gulp: `npm install gulp -g --registry=https://registry.npm.taobao.org`
* 安装依赖: `npm install --registry=https://registry.npm.taobao.org`
* 在Yo根目录下运行:
    * `gulp watch`: 如果你想监听所有文件的变更
    * `gulp build`: 如果你只是想build一次该项目


<a name="how-to-start"></a>
## 如何开始

通过上述的 `环境搭建`，`Yo` 就已经可以在你的机器上跑起来了，在 `Yo` 根目录下运行 `gulp test`，会在 `usage/test` 目录生成一个 `test.css`，这表示一切OK（当然，项目中你可以将test文件夹移除）。


<a name="rules"></a>
## 工程约束

真正的编码之前，先看一下 `Yo` 的目录结构是非常重要的，这有助于理解并更好的使用它：

* `lib` 目录是 `Yo` 框架的底层代码，不要改动它，避免日后升级时遇到麻烦；
* `usage` 目录正是你的舞台，在这做业务的样式编码；
    * `usage/core` 目录下的都是配置文件，比如你想改变某些设定的初始值；
    * 需要编译使用的文件（一般来说都是page级别的文件），放在 `usage/page` 目录下，编译后，会输出到 `usage/export` 目录；
    * `usage` 下的其它目录和 `lib` 里的目录一一对应，用于放置扩展文件；


<a name="template"></a>
## 示例代码

我们可以开始真正的使用 `Yo` 来进行编码了，下面将会展示一段最简单的代码，我们要做一个列表页，其对应的样式表文件为：`list.scss`：

    @charset "utf-8";
    @import "../core/reset";
    @import "../fragment/yo-flex";
    @import "../fragment/yo-header";
    @import "../element/yo-list";

    // 下面这段模块化的代码，请新建一个 `m-xxx` 的文件并将代码移过去，然后 `@import` 到这里
    // 为了方便演示，所以下述代码直接写在了这里
    .m-xxx {
        // 由于这里所需要的`list`和默认展示不同，所以使用 `yo-list` 进行扩展
        @include yo-list(
            $margin: .1rem,
            $border-width: 1px,
            $border-color: #ccc,
            $radius: .1rem
        );
    }

首先，我们将 `reset` 引入 `list.scss`，这是必须的；该列表页由一个 `yo-header` 和 `yo-list` 组成，于是引入与之相关的2个元件；同时，我们想要使用 `flex` 布局，所以引入了 `yo-flex` 元件。

在页面上请使用 `list.scss` 编译后的 `list.css` 文件。


<a name="attention"></a>
## 注意

`Yo` 做了一些全局的定义，这些定义也让设计变得意思。

### 文档模式

为了能够让你的样式得到完整的解析，我们推荐你使用 `HTML5 doctype`：

    <!DOCTYPE html>

### 视窗viewport

`Yo` 采用 `Mobile First` 的策略设计，首先要保证移动设备上的体验，至于不同的终端，可以配合 `响应式` 来做适配：

    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />

如果应用需要考虑手动缩放的情况，可以将 `maximum-scale=1, user-scalable=no` 移除；但不建议移除 `minimum-scale=1`，因为页面可能会被缩小到难以阅读的程度。

### 单位

`Yo` 约束了2种项目所使用的长度单位

* 所有涉及到 `border` 的长度单位都是用 `px`；
* 除 `border` 外，所有的长度设置都是用 `rem` 单位；

### 盒模型

为了让计算变得简单，我们改变了所有元素的盒模型，将其重置为 `border-box`。当然，也包括常用的伪元素 `::before` 和 `::after`。

    *,
    ::before,
    ::after {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

如果你长时间工作在 `PC` 平台上，这个设定可能需要一个适应的过程，但可以肯定的是，你一定会喜欢上它。


<a name="supported-browsers"></a>
## 浏览器支持

* iOS6.0+
* Android4.0+
* Latest Stable: Chrome, Safari, Opera, IE10+


<a name="documentation-and-demo"></a>
## 实例和文档

* [View Demo](http://doyoe.github.io/Yo/demo/)
* [View Documentation](http://doyoe.github.io/Yo/doc/)


<a name="versioning"></a>
## 版本

`Yo` 的版本方针遵循 [SemVer](http://semver.org/lang/zh-CN/) 规范，版本号采用 `主版本号.次版本号.修订号` 的格式。版本发布周期是透明的，并尽可能保证向前向后兼容，您可以根据我们的语义化版本方针进行版本控制。

`master` 分支为开发版本，稳定版本都发布在 [releases tag](https://github.com/doyoe/Yo/releases) 中。

**最新稳定版: [v2.1.4](https://github.com/doyoe/Yo/releases/tag/v2.1.4)**

**开发中版本: v2.1.5**

如想查看更多版本变更历史，请查看 [ChangeLog](https://github.com/doyoe/Yo/blob/master/changelog.md)


<a name="bugs-and-feature-requests"></a>
## 问题及反馈

如果您的项目正在使用`Yo`，过程中发现了任何问题，或者有任何帮助`Yo`更完善的想法和建议，请直接给我提[Issues](https://github.com/doyoe/Yo/issues/new)和[Pull Requests](https://github.com/doyoe/Yo/pulls)。


<a name="author"></a>
## 作者

杜瑶，我目前居住在北京，就职于 [Qunar](http://www.qunar.com)，您可以在 [Github](https://github.com/doyoe) 或者 [Weibo](http://weibo.com/doyoe) 看到我的最近动态。当然，也可以通过我的[个人站点](http://www.doyoe.com)，博客：[CSS探索之旅](http://blog.doyoe.com)，[CSS参考手册](http://css.doyoe.com) 和 [Web前端实验室](http://demo.doyoe.com) 等信息了解更多。


<a name="copyright-and-license"></a>
## 版本和许可

源码和文档版权属于 [doyoe.com](http://www.doyoe.com)。源码发布基于 [the MIT license](http://opensource.org/licenses/MIT) 开源协议。文档发布基于 [Creative Commons](http://creativecommons.org/licenses/by/4.0/) 开源协议。