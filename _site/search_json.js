window.ydoc_plugin_search_json = {
  "文档": [
    {
      "title": "快速开始",
      "content": "YDoc 是一个优雅的文档站构建工具，能够基于 markdown 轻松生成完整静态站点，让你专注于文档写作。YDoc 拥有灵活而强大的插件/主题机制，开发者可以轻松定制属于自己的文档站点。",
      "url": "/documents/index.html",
      "children": [
        {
          "title": "安装依赖",
          "url": "/documents/index.html#安装依赖",
          "content": "安装依赖"
        },
        {
          "title": "安装 Node.js",
          "url": "/documents/index.html#安装依赖-安装-node.js",
          "content": "安装 Node.js方案一: 从 Node.js 官网下载安装包方案二: 使用 Node Version Manager(NVM) 安装 Node.js，你可以通过以下命令安装 NVM :cURL:$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bashWget:$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bashNVM 安装好以后，重启终端并运行以下命令来安装 Node.js :nvm install stable"
        },
        {
          "title": "使用 NPM 安装 YDoc",
          "url": "/documents/index.html#安装依赖-使用-npm-安装-ydoc",
          "content": "使用 NPM 安装 YDocnpm install ydoc [-g]"
        },
        {
          "title": "使用 NPM 安装 rc 版本（发布候选版本）",
          "url": "/documents/index.html#安装依赖-使用-npm-安装-rc-版本（发布候选版本）",
          "content": "使用 NPM 安装 rc 版本（发布候选版本）npm install ydoc@rc [-g]"
        },
        {
          "title": "创建你的站点",
          "url": "/documents/index.html#创建你的站点",
          "content": "创建你的站点mkdir project && cd projectydoc init\nydoc build\nydoc init 执行初始化操作，这将会在当前目录生成一个 'docs' 目录，用于存放文档(markdown)文件。ydoc build 执行构建操作，这将会使用 'docs' 目录中的文件进行文档站的构建，构建成功后会在当前目录生成一个 '_site' 目录，打开 '_site' 目录中的  index.html 文件即可访问构建的文档站首页 🎉🎉"
        },
        {
          "title": "下一步我可以做什么",
          "url": "/documents/index.html#下一步我可以做什么",
          "content": "下一步我可以做什么简单学习即可轻松使用下面的基本功能，这不会花费你很长时间：目录: 了解 YDoc 的目录结构\n导航: 页面顶部的链接\n页面: 编写首页、文档页目录和内容\n"
        }
      ]
    },
    {
      "title": "目录结构",
      "content": "一个基本的 ydoc 目录结构如下:├── docs/    ├── index.jsx\n    ├── NAV.md\n    ├── book-1/\n        ├── index.md\n        └── SUMMARY.md\n    └── book-2/\n        ├── index.md\n        ├── SUMMARY.md\n以下是他们的功能描述:\n\n文件\n描述\n\n\n\n\nindex.jsx\n首页 (必需)\n\n\nNAV.md\n导航) (必需)\n\n\nbook/index.md\n文档页首页] (必需)\n\n\nbook/SUMMARY.md\n文档目录，SUMMARY.md 引用的所有 markdown 文件将会被转换成 html 文件 (可选)\n\n\n注：NAV.md 和 SUMMARY.md 文件名大写\n",
      "url": "/documents/structure.html",
      "children": [
        {
          "title": "静态文件和图片",
          "url": "/documents/structure.html#静态文件和图片",
          "content": "静态文件和图片所有在 docs 目录中且未在 SUMMARY.md 中引用的文件，将会被复制到生成站点的目录中。"
        }
      ]
    },
    {
      "title": "导航",
      "content": "在 NAV.md \b文件可配置网站的导航标题、logo、菜单列表信息，简单示例如下：# YDoc![logo](ydoc/images/logo.png)\n\n* [文档](/documents/index.md)\n* [文档规范](/style-guide/index.md)\n* [插件](/plugins/index.md)\n上面的 markdown 内容可生成如下导航信息：标题：YDocLogo：ydoc/images/logo.png\n导航：文档 文档规范 插件\n",
      "url": "/documents/nav.html",
      "children": [
        {
          "title": "二级导航",
          "url": "/documents/nav.html#二级导航",
          "content": "二级导航YDoc 支持二级导航，如下示例，二级导航在需要在原有的导航上面添加二级标题，即可生成二级导航。# YDoc![logo](ydoc/images/logo.png)\n\n## 文档\n* [教程](/documents/index.md)\n* [规范](/style-guide/index.md)\n\n"
        },
        {
          "title": "一级与二级导航同时存在",
          "url": "/documents/nav.html#一级与二级导航同时存在",
          "content": "一级与二级导航同时存在通过 --- 分隔两种导航# YDoc\n![logo](ydoc/images/logo.png)\n\n## 文档\n* [教程](/documents/index.md)\n* [规范](/style-guide/index.md))\n---\n* [插件](/plugins/index.md)\n\n"
        }
      ]
    },
    {
      "title": "页面",
      "content": "",
      "url": "/documents/pages-index.html",
      "children": [
        {
          "title": "首页",
          "url": "/documents/pages-index.html#首页",
          "content": "首页执行 init 命令后生产 docs 目录中的 index.jsx 就是首页的文档文件，在这个文件中我们可以通过简单的配置来完善首页信息：使用 js 定义页面变量的方式不利于阅读，YDoc 参考了开源工具 gray-matter 在页面注入 YAML 方案，使得变量定义变得轻松加愉快 😜\n如果你不了解 YAML，可以先查看阮一峰的这篇文章：YAML 语言教程首页配置如下："
        },
        {
          "title": "banner 网站标语栏",
          "url": "/documents/pages-index.html#首页-banner-网站标语栏",
          "content": "banner 网站标语栏\n\n属性\n描述\n\n\n\n\nname\n标语标题\n\n\ndesc\n标语描述信息\n\n\nbtns\n按钮组，可设置多个按钮\n\n\ncaption\n说明信息，例如“当前版本信息”\n\n\nbtns[n].name\n按钮名称\n\n\nbtns[n].href\n按钮链接\n\n\nbtns[n].primary\n是否为主按钮\n\n\n"
        },
        {
          "title": "features 特性",
          "url": "/documents/pages-index.html#首页-features-特性",
          "content": "features 特性\n\n属性\n描述\n\n\n\n\nfeatures[n].name\n特性名称\n\n\nfeatures[n].desc\n特性描述\n\n\n"
        },
        {
          "title": "footer 底部信息",
          "url": "/documents/pages-index.html#首页-footer-底部信息",
          "content": "footer 底部信息\n\n属性\n描述\n\n\n\n\ncopyRight\n版权信息\n\n\ncopyRight.name\n版权主体名称\n\n\ncopyRight.href\n版权主体链接\n\n\nlinks\n友情链接\n\n\nlinks.xxx\n链接组标题\n\n\nlinks.xxx[n]\n链接项\n\n\nlinks.xxx[n].name\n链接项名称\n\n\nlinks.xxx[n].href\n链接项名称\n\n\n"
        }
      ]
    },
    {
      "title": "文档页",
      "content": "YDoc 借鉴了 Gitbook 中 \"书\" 的概念：YDoc 的每个导航项都是不同的 \"书\"\n每本 \"书\" 都是由目录和页面组成\nYDoc 文档站就是由若干本书及其他页面组成的网站\n使用 SUMMARY.md 文件生成一本书的目录，SUMMARY 文件包含了一本书的所有章节信息，具体的文档页面一般是若干 markdown 文件，如果你不知道  markdown 是什么，可以查看本文档中 markdown 的介绍SUMMARY.md 由一组链接列表组成，将一个列表嵌套到父章节将创建子章节，简单示例如下：# 目录\n### 章节 1\n\n* [快速开始](start.md)\n  * [安装](installation.md)\n* [项目设置](setting.md)\n  * [配置文件](config.md)\n锚点目录中的章节可以使用锚点指向文件的特定部分。# 目录\n### 章节 2\n\n* [API](api.md)\n  * [a](api.md#anchor1)\n  * [b](api.md#anchor2)\n章节目录可以分为多个部分，如下所示：# 目录\n### 章节 1\n\n* [快速开始](start.md)\n  * [安装](installation.md)\n* [项目设置](setting.md)\n  * [配置文件](config.md)\n\n### 章节 2\n\n* [API](api.md)\n  * [a](api.md#a)\n  * [b](api.md#b)\n\n",
      "url": "/documents/pages-book.html",
      "children": []
    },
    {
      "title": "自定义页面",
      "content": "YDoc 的页面可支持 .md、.jsx、.html 三种类型。我们推荐大部分的文档内容 使用 markdown 编写，少数个性化页面使用 html 或 jsx 实现。",
      "url": "/documents/pages-custom.html",
      "children": [
        {
          "title": "Markdown 规则",
          "url": "/documents/pages-custom.html#markdown-规则",
          "content": "Markdown 规则YDoc 会根据 markdown 内容获取网站标题和描述信息，如下所示，YDoc 会将当前页面标题设置为 “示例”， 页面描述信息设置为 “这是一个示例。”。# 示例这是一个示例。\n\n## 章节1\n\n## 章节2\n\n"
        },
        {
          "title": "Html 规则",
          "url": "/documents/pages-custom.html#html-规则",
          "content": "Html 规则YDoc 支持解析 .html 文件，你可以使用 html 所有特性高度自定义页面内容。"
        },
        {
          "title": "JSX 规则",
          "url": "/documents/pages-custom.html#jsx-规则",
          "content": "JSX 规则JSX 就是 Javascript 和 XML 结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。Ydoc 使用了开源工具 noox  解析 .jsx 文件，详细使用方法参考 jsx"
        }
      ]
    },
    {
      "title": "配置",
      "content": "Ydoc 允许你使用灵活的配置来自定义站点，这些配置项被指定到 ydoc.json 或 ydoc.js 文件，目录结构如下：├── ydoc.json├── docs/\n在 docs 上级目录创建 ydoc.json，如果没有配置文件，ydoc 将使用默认的配置。",
      "url": "/documents/config.html",
      "children": [
        {
          "title": "配置项",
          "url": "/documents/config.html#配置项",
          "content": "配置项\n\n变量\n类型\n默认值\n描述\n\n\n\n\nroot\nString\ndocs\n文档目录\n\n\ntitle\nString\nydoc\n网站标题\n\n\nkeywords\nString\nydoc\n网站关键字\n\n\nauthor\nString\nymfe\n网站作者\n\n\ndescription\nString\nydoc\n网站描述\n\n\ndist\nString\n_site\n网站生成路径\n\n\nplugins\nArray\n[]\n插件列表\n\n\npluginsConfig\nObject\nnull\n插件配置\n\n\n"
        },
        {
          "title": "plugins 配置示例",
          "url": "/documents/config.html#配置项-plugins-配置示例",
          "content": "plugins 配置示例{  \"plugins\": [\"demo\"],\n  \"pluginsConfig\": {\n    \"demo\": {\n      \"title\": \"demo\"\n    }\n  }\n}\n上面的配置含义是加载了插件 demo, 并且给 demo 插件\b设置了配置项:{   \"title\": \"demo\"\n}\n"
        }
      ]
    },
    {
      "title": "Markdown一级标题",
      "content": "Markdown 是一种轻量级标记语言，它以纯文本形式(易读、易写、易更改)编写文档，并最终以 HTML 格式发布。Markdown也可以理解为将以 MARKDOWN 语法编写的语言转换成 HTML 内容的工具。",
      "url": "/documents/markdown.html",
      "children": [
        {
          "title": "语法规范",
          "url": "/documents/markdown.html#语法规范",
          "content": "语法规范YDoc 使用了 CommonMark 语法规范"
        },
        {
          "title": "为什么要使用它",
          "url": "/documents/markdown.html#为什么要使用它",
          "content": "为什么要使用它它是易读（看起开舒服）、易写（语法简单）、易更改纯文本。处处体现着极简主义的影子。\n兼容 HTML，可以转换为 HTML 格式发布。\n跨平台使用。\n越来越多的网站支持 Markdown。\n更方便清晰的组织你的电子邮件。（Markdown-here, Airmail）\n摆脱 Word（我不是认真的）。\n如果不算扩展，Markdown 的语法绝对简单到让你爱不释手。Markdown 语法主要分为如下几大部分： 标题，段落，区块引用，代码区块，强调，列表，分割线，链接，图片，反斜杠 \\，符号'`'，表格。"
        },
        {
          "title": "标题",
          "url": "/documents/markdown.html#为什么要使用它-标题",
          "content": "标题使用#，可表示1-6级标题。# 一级标题\n## 二级标题\n### 三级标题\n#### 四级标题\n##### 五级标题\n###### 六级标题\n效果：一级标题\n二级标题\n三级标题\n四级标题\n五级标题\n六级标题\n"
        },
        {
          "title": "段落",
          "url": "/documents/markdown.html#二级标题-段落",
          "content": "段落段落的前后要有空行，所谓的空行是指没有文字内容。若想在段内强制换行的方式是使用两个以上空格加上回车（引用中换行省略回车）。"
        },
        {
          "title": "区块引用",
          "url": "/documents/markdown.html#二级标题-区块引用",
          "content": "区块引用在段落的每行或者只在第一行使用符号>,还可使用多个嵌套引用，如：> 区块引用\n>> 嵌套引用\n效果：区块引用\n\n嵌套引用\n\n"
        },
        {
          "title": "代码区块",
          "url": "/documents/markdown.html#二级标题-代码区块",
          "content": "代码区块代码区块的建立是在每行加上4个空格或者一个制表符（如同写代码一样）。如普通段落：void main(){\nprintf(\"Hello, Markdown.\");\n}代码区块：void main(){\n    printf(\"Hello, Markdown.\");\n}\n注意:需要和普通段落之间存在空行。"
        },
        {
          "title": "强调",
          "url": "/documents/markdown.html#二级标题-强调",
          "content": "强调在强调内容两侧分别加上*或者_，如：*斜体*，_斜体_\n**粗体**，__粗体__\n效果：斜体，斜体\n粗体，粗体\n"
        },
        {
          "title": "列表",
          "url": "/documents/markdown.html#二级标题-列表",
          "content": "列表使用·、+、或-标记无序列表，如：-（+*） 第一项\n-（+*） 第二项\n- （+*）第三项\n注意：标记后面最少有一个 空格 或 制表符 。若不在引用区块中，必须和前方段落之间存在空行。效果：\n第一项\n第二项\n第三项\n\n有序列表的标记方式是将上述的符号换成数字,并辅以.，如：1 . 第一项\n2 . 第二项\n3 . 第三项\n效果：\n第一项\n第二项\n第三项\n\n"
        },
        {
          "title": "分割线",
          "url": "/documents/markdown.html#二级标题-分割线",
          "content": "分割线分割线最常使用就是三个或以上*，还可以使用-和_。"
        },
        {
          "title": "链接",
          "url": "/documents/markdown.html#二级标题-链接",
          "content": "链接链接可以由两种形式生成：行内式和参考式。行内式：[url](https:://github.com/ymfe \"Markdown\")。\n效果：url\n"
        },
        {
          "title": "图片",
          "url": "/documents/markdown.html#二级标题-图片",
          "content": "图片添加图片的形式和链接相似，只需在链接的基础上前方加一个!。"
        },
        {
          "title": "反斜杠\\",
          "url": "/documents/markdown.html#二级标题-反斜杠\\",
          "content": "反斜杠\\相当于反转义作用。使符号成为普通符号。"
        },
        {
          "title": "符号'`'",
          "url": "/documents/markdown.html#二级标题-符号'`'",
          "content": "符号'`'起到标记作用。如：`ctrl+a`\n效果：ctrl+a\n"
        },
        {
          "title": "表格",
          "url": "/documents/markdown.html#二级标题-表格",
          "content": "表格用|表示表格纵向边界，表头和表内容用-隔开，并可用:进行对齐设置，两边都有:则表示居中，若不加:则默认左对齐。|key          | value |:-----------:|------ |\n|title        | ydoc  |\n|content      | ydoc  |\n\n效果：\n\nkey\nvalue\n\n\n\n\ntitle\nydoc\n\n\ncontent\nydoc\n\n\n"
        }
      ]
    },
    {
      "title": "命令",
      "content": "通过 ydoc --help 命令查看全部命令    Usage: ydoc [command]\n    命令：\n    ydoc build  Generate the document site\n    ydoc init   Initialize a document site\n    ydoc serve  Starts a local server. By default, this is at\n                http://127.0.0.1:9999\n    ydoc theme  Install a theme\n\n    选项：\n    --version   显示版本号                             [布尔]\n    -h, --help  显示帮助信息                           [布尔]\n",
      "url": "/documents/command-index.html",
      "children": [
        {
          "title": "init 初始化",
          "url": "/documents/command-index.html#init-初始化",
          "content": "init 初始化ydoc init 执行初始化操作，这将会在当前目录生成一个 'docs' 目录，用于存放文档(markdown)文件。"
        },
        {
          "title": "build 构建",
          "url": "/documents/command-index.html#build-构建",
          "content": "build 构建ydoc build 执行构建操作，这将会使用 'docs' 目录中的文件进行文档站的构建，构建成功后会在当前目录生成一个 '_site' 目录，打开 '_site' 目录中的 index.html 文件即可访问构建的文档站首页 🎉🎉"
        },
        {
          "title": "serve 服务",
          "url": "/documents/command-index.html#serve-服务",
          "content": "serve 服务ydoc serve 可以启动一个服务，默认是http://127.0.0.1:9999。修改docs目录下的文档，可以实时在http://127.0.0.1:9999看到变化。"
        },
        {
          "title": "theme 主题",
          "url": "/documents/command-index.html#theme-主题",
          "content": "theme 主题ydoc theme可以安装theme主题，例如 ydoc theme ydoc-theme-demo可以安装demo theme主题ydoc theme ydoc-theme-demo -c或者 ydoc theme ydoc-theme-demo --copy会默认安装一个主题，并且在项目根目录下会生成一个theme文件夹，文件夹中有一个ydoc-theme-demo的文件，ydoc-theme-demo文件中是主题的内容，修改该文件即可定制主题"
        }
      ]
    },
    {
      "title": "主题",
      "content": "YDoc 提供了简单易用强大的自定义主题功能。",
      "url": "/documents/theme.html",
      "children": [
        {
          "title": "安装",
          "url": "/documents/theme.html#安装",
          "content": "安装1.假设要安装 demo 主题，请执行以下命令：npm install --save-dev ydoc-theme-demo或者ydoc theme ydoc-theme-demo2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "自定义主题",
          "url": "/documents/theme.html#自定义主题",
          "content": "自定义主题"
        },
        {
          "title": "新建主题",
          "url": "/documents/theme.html#自定义主题-新建主题",
          "content": "新建主题1.在根目录下创建 theme 文件夹，然后创建对应的 theme 文件夹，比如 ydoc-theme-demo, 在文件夹下写对应的主题2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "基于已有主题定制",
          "url": "/documents/theme.html#自定义主题-基于已有主题定制",
          "content": "基于已有主题定制1.在项目根目录下执行以下命令：ydoc theme ydoc-theme-demo -c或者ydoc theme ydoc-theme-demo --copy命令执行完成后，项目根目录下会生成一个theme文件夹，文件夹中有一个ydoc-theme-demo的文件，ydoc-theme-demo文件中是主题的内容，修改该文件即可定制主题2.然后在 ydoc.json 配置：{  \"theme\": \"demo\"\n}\n"
        },
        {
          "title": "定制主题的技巧",
          "url": "/documents/theme.html#自定义主题-定制主题的技巧",
          "content": "定制主题的技巧1. 使用 sass 编译主题的 css官方提供的主题使用了 sass 预处理器，官方主题的根目录下的 build.js 文件用于构建 css，例：ydoc theme ydoc-theme-dark --copynode theme/ydoc-theme-dark/build.js\n即可编译 dark 主题的 css2. 快速修改主题色"
        },
        {
          "title": "主题列表",
          "url": "/documents/theme.html#主题列表",
          "content": "主题列表ydoc-theme-demo\nydoc-theme-dark\n"
        }
      ]
    },
    {
      "title": "模板与变量",
      "content": "YDoc 主题的模板是若干的 jsx 组件，以下是各模板文件相对应的功能（按首字母排序）：\n\n模板\n功能\n\n\n\n\nContent.jsx\n文档页内容\n\n\nFooter.jsx (用户自定义组件)\nFooter 信息\n\n\nHead.jsx\nhtml 文件中  部分的内容\n\n\nHeader.jsx\n顶部导航\n\n\nHomepage.jsx (用户自定义组件)\n文档站首页\n\n\nHook.jsx\n钩子，用于自定义插件\n\n\nIcon.jsx\nfavicon 图片\n\n\nLayout.jsx\nhtml 文件，其他组件的入口\n\n\nLogo.jsx\n配置网站的 logo\n\n\nScripts.jsx\nscript 脚本\n\n\nSummary.jsx\n侧栏目录\n\n\n有的模板中使用了 YDoc 提供的 变量 ，这些变量可以在当前模板文件中任意位置使用，因此你可以灵活定制自己的主题，变量列表如下：",
      "url": "/documents/template.html",
      "children": [
        {
          "title": "变量",
          "url": "/documents/template.html#变量",
          "content": "变量"
        },
        {
          "title": "Content.jsx（文档页内容）",
          "url": "/documents/template.html#变量-content.jsx（文档页内容）",
          "content": "Content.jsx（文档页内容）\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\nprops.type\n内容类型, markdown 页面为 'md'\n\n\nprops.content\n页面内容，一段 html\n\n\nprops.prev\n上一页信息\n\n\nprops.prev.distPath\n上一页的相对路径\n\n\nprops.prev.title\n上一页的页面标题\n\n\nprops.next\n下一页信息\n\n\nprops.next.distPath\n下一页的相对路径\n\n\nprops.next.title\n下一页的页面标题\n\n\n"
        },
        {
          "title": "Head.jsx（html 文件中  部分的内容）",
          "url": "/documents/template.html#变量-head.jsx（html-文件中-部分的内容）",
          "content": "Head.jsx（html 文件中  部分的内容）\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\nprops.title\n当前页面标题\n\n\nprops.config.author\n网站作者\n\n\nprops.config.keywords\n网站关键字\n\n\nprops.config.description\n网站描述\n\n\nprops.assets.css\n钩子中的 css 路径\n\n\n"
        },
        {
          "title": "Header.jsx（顶部导航）",
          "url": "/documents/template.html#变量-header.jsx（顶部导航）",
          "content": "Header.jsx（顶部导航）\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\nprops.title\n当前页面标题\n\n\nprops.config.author\n网站作者\n\n\nprops.config.keywords\n网站关键字\n\n\nprops.config.description\n网站描述\n\n\nprops.assets.css\n钩子中的 css 路径\n\n\nprops.ydoc\n顶级 props\n\n\nprops.ydoc.bookpath\nbook 路径\n\n\n"
        },
        {
          "title": "Icon.jsx",
          "url": "/documents/template.html#变量-icon.jsx",
          "content": "Icon.jsx\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\n"
        },
        {
          "title": "Layout.jsx",
          "url": "/documents/template.html#变量-layout.jsx",
          "content": "Layout.jsx\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\nprops.summary\n侧栏目录配置\n\n\nprops.config\n配置信息（ydoc 配置）\n\n\nprops.assets\n钩子中的 assets 配置\n\n\nprops.title\n当前页面标题\n\n\nprops.page\n页面信息\n\n\n"
        },
        {
          "title": "Logo.jsx",
          "url": "/documents/template.html#变量-logo.jsx",
          "content": "Logo.jsx\n\n变量\n描述\n\n\n\n\nprops.distPath\n当前页面路径\n\n\nprops.nav\n顶部导航信息（配置在 NAV.md 中）\n\n\nprops.nav.logo\nlogo\n\n\nprops.nav.title\nlogo 旁的标题\n\n\n"
        },
        {
          "title": "Scripts.jsx",
          "url": "/documents/template.html#变量-scripts.jsx",
          "content": "Scripts.jsx\n\n变量\n描述\n\n\n\n\nprops.page.distPath\n当前页面路径\n\n\n"
        },
        {
          "title": "Summary.jsx",
          "url": "/documents/template.html#变量-summary.jsx",
          "content": "Summary.jsx\n\n变量\n描述\n\n\n\n\nprops.summary\n侧栏目录\n\n\nprops.releativePath\n目录项的相对路径\n\n\n"
        }
      ]
    },
    {
      "title": "JSX",
      "content": "React发明了JSX， 可以简单地理解它是一种在JS中编写与XML类似的语言。通过JSX来声明组件的属性，类型与结果，并且通过｀{}`插值，套嵌JS逻辑与子级的JSX。",
      "url": "/documents/jsx.html",
      "children": [
        {
          "title": "JSX的特点：",
          "url": "/documents/jsx.html#jsx的特点：",
          "content": "JSX的特点：类XML语法容易接受，结构清晰\n增强JS语义\n抽象程度高，屏蔽DOM操作，跨平台\n代码模块化\n我们从最简单的一个helloworld开始：Hello, world!script标签里面的内容实际会被编译成React.createElement('h1', null, 'Hello, world!');又如var root =(  \n    First Text Content\n    Second Text Content\n  \n);\n会被编译成var root = React.createElement('ul', { className: 'my-list' },  React.createElement('li', null, 'First Text Content'),\n  React.createElement('li', null, 'Second Text Content')\n);\n"
        },
        {
          "title": "JSX语法介绍",
          "url": "/documents/jsx.html#jsx语法介绍",
          "content": "JSX语法介绍｀{}`插值是让JSX区别普通HTML的一个重要特性，只有三个地方可以使用它。可以放属性名的地方，属性等于号之后的位置及innerHTML之间。1.可以放属性名的地方,  这里只能使用JSXSpreadAttribute(延伸属性)， 换言之，括号内必须带三个点号var props = {};props.foo = x;\nprops.bar = y;\nvar component = ;\n2.属性等于号之后的位置, JSX的属性值必须用引号括起来，当你将引号改成花括号，它里面就可以使用JSX变量了。相当于其他框架的绑定属性或指令。需要说明一下，HTML的固有属性必须使用JS形式，保持驼峰风格，如class要用className代替，for要用htmlFor代替，tabindex要用tabIndex代替，colspan要用colSpan代替。花括号里面可以使用三元表达式var person = ;会编译成var person = React.createElement(  Person,\n  {name: window.isLoggedIn ? window.name : ''}\n);\n3.innerHTMLxxx{111}yyy这个会编译成,  相邻的字任串或数字会合并成一个字符串，布尔，null, undefined会被忽略掉。React.createElement('div', null, \"xxx111yyy\")在innerHTML里面，我们可以使用数组或数组的map方法生成一个新数组的方法，为当前父元素添加一堆子元素。var ul = (  \n    {\n      this.todoList.todos.map(function (todo) {\n        return  (\n          \n            \n            {todo.text}\n          \n        );\n      })\n    }\n  \n);\n"
        },
        {
          "title": "JSX中使用样式",
          "url": "/documents/jsx.html#jsx中使用样式",
          "content": "JSX中使用样式在JSX中使用样式和真实的样式也很类似，通过style属性来定义，但和真实DOM不同的是，`属性值不能是字符串而必须为对象｀。Hello World.或者var style = {  color: '#f00',\n  fontSize: '14px'\n};\n\nvar node = HelloWorld.;\n要明确记住,{}里面是JS代码,这里传进去的是标准的JS对象。在JSX中可以使用所有的样式，基本上属性名的转换规范就是将其写成驼峰写法，例如“background-color”变为“backgroundColor”, “font-size”变为“fontSize”，这和标准的JavaScript操作DOM样式的API是一致的。"
        },
        {
          "title": "HTML转义",
          "url": "/documents/jsx.html#html转义",
          "content": "HTML转义在组件内部添加html代码,并将html代码渲染到页面上。React默认会进行HTML的转义，避免XSS攻击，如果要不转义，可以使用dangerouslySetInnerHTML属性。dangerouslySetInnerHTML要求对应一个对象，里面有一个叫__html的字符串。React故意搞得这么难写，目的让大家少点用它。content'}}>注意：JSX里面br，input, hr等标签必须自闭合，如必须写成并且使用了dangerouslySetInnerHTML"
        },
        {
          "title": "属性的定义",
          "url": "/documents/jsx.html#属性的定义",
          "content": "属性的定义JSX是严格区分固有属性与自定义属性， 固有属性是指元素原形链上就已存在的属性，比如id, title, className, htmlFor, style，colSpan。这些属性是严格区分大小写。并且对属性值也有要求。固有属性根据其值的类型，可以分为布尔属性与字符串属性。布尔属性一般出现在表单元素与A，script等标签上，如disabled, readOnly, selected, checked等等。布尔属性时，大家在使用时，值必须是布尔\n字符串属性也比较常见：value,id,title,alt,htmlFor,longDesc,className还有一些不规则的属性(不需要刻意记，只要记住上面两种就是)accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan,dateTime,defaultValue,contentEditable,frameBorder,maxLength,marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign而自定义属性，则是用户随便设置的。"
        },
        {
          "title": "如何自定义组件",
          "url": "/documents/jsx.html#如何自定义组件",
          "content": "如何自定义组件在 YDoc 新建组件是非常简单的，第一步在 docs 目录下新建 _components 目录假设我们要新建一个 Demo 组件，可以新建 Demo.jsx 文件（确保文件名第一个字母大写），文件内容如下：一般来说，我们可以通过标签名的第一个字母是大写还是小写来识别组件与普通标签。      Hello, !\n    It is {props.date}\n  \n"
        },
        {
          "title": "如何引用自定义组件",
          "url": "/documents/jsx.html#如何引用自定义组件",
          "content": "如何引用自定义组件假设有一个 Demo2 组件，想引用 Demo 组件，可在 Demo2.jsx 文件写入以下示例代码引入：\n"
        },
        {
          "title": "自定义页面变量",
          "url": "/documents/jsx.html#自定义页面变量",
          "content": "自定义页面变量如果使用 js 自定义页面变量，将会非常难用和不优雅，YDoc 参考了开源工具 gray-matter 在页面注入 YAML 方案。---title: Hello\nslug: home\n---\n{title}, {slug}\n"
        },
        {
          "title": "系统内部组件",
          "url": "/documents/jsx.html#系统内部组件",
          "content": "系统内部组件系统内置了如下的组件，请尽量避免跟系统组件重名，因为一旦重名，将会覆盖系统的原有组件。Content\nFooter\nHead\nHeader\nHomepage\nHook\nLayout\nLogo\nScript\nSummary\n"
        }
      ]
    },
    {
      "title": "插件",
      "content": "YDoc 强大的插件功能，满足你个性化的需求。",
      "url": "/documents/plugins.html",
      "children": [
        {
          "title": "浏览插件",
          "url": "/documents/plugins.html#浏览插件",
          "content": "浏览插件请访问 ydoc 官网 - 插件 浏览插件。"
        },
        {
          "title": "安装插件",
          "url": "/documents/plugins.html#安装插件",
          "content": "安装插件假设要安装的插件名是 demo，执行如下命令：npm install --save-dev ydoc-plugin-demo安装完成后，请在 ydoc.json 配置项，添加：{  \"plugins\": [\"demo\"]\n}\n"
        },
        {
          "title": "插件配置",
          "url": "/documents/plugins.html#插件配置",
          "content": "插件配置部分插件需要做自定义配置, 假设 demo 插件需要添加 {id: 1} 的配置，只需要在 ydoc.json ，添加如下配置项：{  \"pluginsConfig\": {\n    \"demo\": {\n      \"id\": 1\n    }\n  }\n}\n"
        },
        {
          "title": "插件使用技巧",
          "url": "/documents/plugins.html#插件使用技巧",
          "content": "插件使用技巧"
        }
      ]
    },
    {
      "title": "创建插件",
      "content": "YDoc 插件是发布到 npm 的 node 包，本篇教程假定你已经拥有了 npm 和 node 相关的经验。",
      "url": "/documents/create.html",
      "children": [
        {
          "title": "基本插件",
          "url": "/documents/create.html#基本插件",
          "content": "基本插件"
        },
        {
          "title": "目录结构",
          "url": "/documents/create.html#基本插件-目录结构",
          "content": "目录结构一个基本的插件有如下的文件结构：├── ydoc-plugin-demo/    ├── index.js\n    ├── package.json\n"
        },
        {
          "title": "index.js",
          "url": "/documents/create.html#基本插件-index.js",
          "content": "index.jsindex.js 是插件的入口文件，init、finish、page:before、page 是插件绑定的钩子。每个插件都可以绑定不同的钩子实现各种各样的功能。module.exports = {  init: function() {\n    console.log('init');\n  },\n  finish: function() {    \n    console.log('end...');\n  },\n  'page:before': function(page) {\n    console.log('beforePage', page);\n  },\n  page: function(page) {\n    console.log('page', page);\n  }\n}\n"
        },
        {
          "title": "私有插件",
          "url": "/documents/create.html#私有插件",
          "content": "私有插件私有插件的配置直接写在 YDoc 的配置文件中，在 plugin 字段中新增数组项：plugins[n].name 为插件名称，不允许重名\nplugins[n].module 和基本插件中的 index.js 的 module.exports 内容一致\nmodule.exports = {  plugins: [{\n    name: \"privatePlugin\",\n    module: {\n      init: function() {\n        console.log('init privatePlugin successfully!');\n      }\n    }\n  }]\n}\n我们鼓励开发者将插件发布到 npm 社区"
        }
      ]
    },
    {
      "title": "钩子",
      "content": "",
      "url": "/documents/hooks.html",
      "children": [
        {
          "title": "钩子列表",
          "url": "/documents/hooks.html#钩子列表",
          "content": "钩子列表全局钩子\n\n名称\n描述\n\n\n\n\ninit\n在生成文档站点前触发.\n\n\nnav\n在解析导航 nav.md 后和解析文档前触发\n\n\nbook:before\n加载 book 页面之前调用\n\n\npage:before\n加载 page 文件之前调用\n\n\npage\n加载 page 文件之后调用\n\n\nbook\n加载 book 页面之后调用\n\n\nfinish\n在生成文档站点完成后触发.\n\n\n模板钩子\n\n名称\n描述\n参数\n\n\n\n\ntpl:header\n在页面 header 中添加自定义的 html\n无\n\n\ntpl:mask\n用于添加遮罩层\n无\n\n\nPage Object{  // 页面类型，支持 md jsx html 三种\n  type: 'md',\n  // 页面标题\n  title: 'string',\n  // 页面描述信息\n  description: 'string',\n  // 页面内容\n  content: '内容',\n  prev: '上一页连接',\n  next: '下一页链接',\n  releativePath: '相对路径',\n  srcPath: '源文件路径',\n  distPath: '生成文件路径'\n}\n\n增加页面内容示例使用 page:before 钩子{\t\"page:before\": function(page) {\n\t\tpage.content = page.content + \"\\n Hello YDoc\";\n\t\treturn page;\n\t}\n}\n替换 html 示例使用 page 钩子{\t\"page\": function(page) {\n\t\tpage.content = page.content.replace(\"\", \"\")\n\t\t\t.replace(\"\", \"\");\n\t\treturn page;\n\t}\n}\n引用静态文件使用 assets 钩子{\tassets: {\n\t\tdir: './assets',\n\t\tjs: ['app.js'],\n\t\tcss: ['app.css']\n  }\n}\n复制当前目录下的 assets 文件夹到文档，并且在每个文件引入 app.js 和 app.css。"
        },
        {
          "title": "异步操作",
          "url": "/documents/hooks.html#钩子列表-异步操作",
          "content": "异步操作回调参数返回一个 promise,能够支持异步处理。Example:{\t\"init\": function() {\n\t\treturn new Promise((function(resolve) {\n\t\t\tsetTimeout(function() {\n\t\t\t\tresolve(true);\n\t\t\t}, 2000);\n\t\t}))\n\t}\n}\n"
        }
      ]
    },
    {
      "title": "markdown 扩展",
      "content": "YDoc 使用了开源工具 markdown-it 解析 markdown，可以使用 markdown-it 已有的插件或开发新的插件定制功能，具体可参考 markdown-it 开发文档。",
      "url": "/documents/markdown-it.html",
      "children": [
        {
          "title": "YDoc 配置 markdown-it 插件",
          "url": "/documents/markdown-it.html#ydoc-配置-markdown-it-插件",
          "content": "YDoc 配置 markdown-it 插件在 ydoc.js 配置文件增加 markdownIt 配置项{  markdownIt: function() {\n    md.use(plugin1)\n    .use(plugin2, opts, ...)\n    .use(plugin3);\n  }\n}\n"
        }
      ]
    },
    {
      "title": "常见问题",
      "content": "",
      "url": "/documents/qa.html",
      "children": [
        {
          "title": "替换 favicon",
          "url": "/documents/qa.html#替换-favicon",
          "content": "替换 favicon替换 favicon, 建议使用 Favicon Generator 生成你想要的 favicon在 docs 目录下，新建 _components 文件夹，创建 Icon.jsx 文件，复制以下源码，可将系统默认的 favicon 替换成 docs/images/xxx\n\n\n\n"
        },
        {
          "title": "引入 js 和 css",
          "url": "/documents/qa.html#引入-js-和-css",
          "content": "引入 js 和 css配置如下：{  \"pluginsConfig\": {\n    \"import-asset\": {\n      \"css\": [\"custom.css\"],\n      \"js\": [\"custom.js\"]\n    }\n  }\n}\n\n"
        }
      ]
    },
    {
      "title": "",
      "content": "",
      "url": "/documents/release.html",
      "children": [
        {
          "title": "v4.1.1 (2019.09.19)",
          "url": "/documents/release.html#v4.1.1-2019.09.19",
          "content": "v4.1.1 (2019.09.19)增加后退定位到记忆位置功能\n文档站优化，增强易用性\n"
        },
        {
          "title": "v4.1.0 (2018.10.10)",
          "url": "/documents/release.html#v4.1.0-2018.10.10",
          "content": "v4.1.0 (2018.10.10)主题功能优化，定制更方便\n样式优化，优化 markdown 阅读体验\n文档站优化，增强易用性\n文档站提供示例 Demo\n"
        },
        {
          "title": "v4.0.6 (2018.08.23)",
          "url": "/documents/release.html#v4.0.6-2018.08.23",
          "content": "v4.0.6 (2018.08.23)样式优化，优化 markdown 阅读体验\n修复不支持中文等特殊符号路径的问题\n"
        },
        {
          "title": "v4.0.5 (2018.07.04)",
          "url": "/documents/release.html#v4.0.5-2018.07.04",
          "content": "v4.0.5 (2018.07.04)init 命令优化, 支持初始化时配置网站信息\n优化 favicon 的配置\nmarkdown 支持 html 语法 (使用 haml 语法解析)\nUI 优化\n"
        },
        {
          "title": "v4.0.4 (2018.05.22)",
          "url": "/documents/release.html#v4.0.4-2018.05.22",
          "content": "v4.0.4 (2018.05.22)修复部分侧栏目录无法高亮的 bug\n新增插件： ydoc-plugin-edit-page 支持在页面尾部添加 ‘编辑此页面’ 的链接\n文档梳理与优化\n"
        },
        {
          "title": "v4.0.3 (2018.04.13)",
          "url": "/documents/release.html#v4.0.3-2018.04.13",
          "content": "v4.0.3 (2018.04.13)移动端布局优化\n新增系统组件 Icon，可自定义网站各种图标\n新增 nav 钩子\n支持使用 nodejs 通过 require('ydoc')(config) 生成文档\n代码高亮支持 jsx 语法\n修复文本编码问题\n"
        },
        {
          "title": "v4.0.2 (2018.04.02)",
          "url": "/documents/release.html#v4.0.2-2018.04.02",
          "content": "v4.0.2 (2018.04.02)修复路径错误、滚动定位闪烁、侧栏滚动等bug\n优化文档样式\n完善文档说明\n新增图片浏览插件: img-view\n"
        },
        {
          "title": "v4.0.1 (2018.03.30)",
          "url": "/documents/release.html#v4.0.1-2018.03.30",
          "content": "v4.0.1 (2018.03.30)优化文档样式\n记录滚动高度功能优化\n全文搜索插件优化\n增强导航配置健壮性\n"
        },
        {
          "title": "v4.0.0 (2018.03.29)",
          "url": "/documents/release.html#v4.0.0-2018.03.29",
          "content": "v4.0.0 (2018.03.29)新 YDoc v4.0.0 版本发布啦！ 🎉🎉🎉重构: 经过长达数年的文档构建工作，我们积攒了大量构建文档的经验，此刻我们卸下历史包袱、厚积薄发、精雕细琢地打造了拥有卓越的视觉与交互体验的文档构建工具！\n灵活的插件机制: 万物皆插件，YDoc 虽然是一个非常轻量的工具，但插件机制让它灵活地应用于各种复杂场景\n响应式设计，支持手持设备访问\n简洁而严谨的 UI 设计\n文档设计规范\n"
        }
      ]
    }
  ],
  "示例 Demo": [
    {
      "title": "Demo 介绍",
      "content": "我们为大家提供了一系列 Demo 的在线预览，你可以通过这些 Demo 来了解 YDoc 构建文档的能力，在你构建遇到困惑的时候不妨先看下 Demo 中有没有类似的效果，效仿该效果进行配置即可。",
      "url": "/examples/index.html",
      "children": [
        {
          "title": "本地调试 Demo",
          "url": "/examples/index.html#本地调试-demo",
          "content": "本地调试 Demo首先将 YDoc 项目 clone 到本地：git clone git@github.com:YMFE/ydoc.gitcd ydoc/examples\nydoc/examples 目录下有若干 Demo，你可以进入各个 Demo 的目录中执行 YDoc build 来进行本地调试。\n\nDemo 名称\n描述\n\n\n\n\n初始化\nYDoc 一键生成文档的最简版本。\n\n\n首页使用 markdown\n默认主题的首页使用 markdown 的方式\n\n\n使用插件\nYDoc 标准插件与 markdown-it 插件的使用\n\n\n使用主题\nYDoc 使用编辑主题\n\n\n"
        }
      ]
    }
  ],
  "设计规范": [
    {
      "title": "设计规范",
      "content": "",
      "url": "/standard/style-guide.html",
      "children": [
        {
          "title": "YDoc 项目设计规范",
          "url": "/standard/style-guide.html#ydoc-项目设计规范",
          "content": "YDoc 项目设计规范YDoc 的设计稿经过设计师的几度推敲重做，诞生了现在你看到的默认主题 🤓，YDoc 有如下设计理念：💃 青春：使用大胆、活泼的配色方案，体现 YMFE 团队 的产品文化\n🤗 科学：以科学的态度对待视觉设计、功能设计，让设计有迹可循\n🤔 简洁：以 无形 代替 有形，从 UI 到开发体验，不断去除冗余的设计，使用户专注于写作与阅读\n以下是 YDoc 设计过程中总结的一些规则，这些可以帮助你构建优美的文档页面："
        },
        {
          "title": "图片",
          "url": "/standard/style-guide.html#ydoc-项目设计规范-图片",
          "content": "图片禁止使用未经压缩处理的图片\n使用图片的原始高宽比，禁止手动调整高宽比\n在高清屏幕请使用2倍/3倍图，防止图像模糊\n"
        },
        {
          "title": "排版",
          "url": "/standard/style-guide.html#ydoc-项目设计规范-排版",
          "content": "排版文档正文使用 16px 字号，但默认字号为 14px，这是为了增强正文部分的阅读体验\n请限制每行文字的宽度(行宽)，以一行 40-60 字为宜：\n\n行宽过短，用户需要频繁移动视线，影响阅读连贯性\n行宽过长，容易视觉疲劳，用户很难专注于一行文本阅读，从大段文字中找到下一行变得更困难\n\n\n行宽的设计参考 Readability: the Optimal Line Length\nYDoc 正文排版经历过精心设计，不建议用户修改正文排版"
        },
        {
          "title": "项目规范文件",
          "url": "/standard/style-guide.html#ydoc-项目设计规范-项目规范文件",
          "content": "项目规范文件YDoc 继承自 Youth Design。现在将 YDoc 的LOGO、色彩、排版等规范提供给大家，希望能给大家在自定义样式或定制主题的时候提供一些帮助：  \n    \n    YDoc 项目设计规范\n    YDoc 规范 sketch 文件\n  \n  \n    \n    YDoc LOGO\n    Logo sketch 文件\n  \n"
        }
      ]
    },
    {
      "title": "文档体系",
      "content": "",
      "url": "/standard/index.html",
      "children": [
        {
          "title": "目录结构",
          "url": "/standard/index.html#目录结构",
          "content": "目录结构软件手册是一部完整的书，建议采用下面的目录结构。简介（Introduction）： [必备] [文件] 提供对产品和文档本身的总体的、扼要的说明\n快速上手（Getting Started）：[可选] [文件] 如何最快速地使用产品\n入门篇（Basics）： [必备] [目录] 又称”使用篇“，提供初级的使用教程\n\n环境准备（Prerequisite）：[必备] [文件] 软件使用需要满足的前置条件\n安装（Installation）：[可选] [文件] 软件的安装方法\n设置（Configuration）：[必备] [文件] 软件的设置\n\n\n进阶篇（Advanced)：[可选] [目录] 又称”开发篇“，提供中高级的开发教程\nAPI（Reference）：[可选] [目录|文件] 软件 API 的逐一介绍\nFAQ：[可选] [文件] 常见问题解答\n附录（Appendix）：[可选] [目录] 不属于教程本身、但对阅读教程有帮助的内容\n\nGlossary：[可选] [文件] 名词解释\nRecipes：[可选] [文件] 最佳实践\nTroubleshooting：[可选] [文件] 故障处理\nChangeLog：[可选] [文件] 版本说明\nFeedback：[可选] [文件] 反馈方式\n\n\n下面是两个真实范例，可参考。Redux 手册\nAtom 手册\n"
        },
        {
          "title": "文件名",
          "url": "/standard/index.html#文件名",
          "content": "文件名文档的文件名不得含有空格。文件名必须使用半角字符，不得使用全角字符。这也意味着，中文不能用于文件名。错误： 名词解释.md\n正确： glossary.md\n文件名建议只使用小写字母，不使用大写字母。错误：TroubleShooting.md\n正确：troubleshooting.md \n为了醒目，某些说明文件的文件名，可以使用大写字母，比如README、LICENSE。文件名包含多个单词时，单词之间建议使用半角的连词线（-）分隔。不佳：advanced_usage.md\n正确：advanced-usage.md\n"
        },
        {
          "title": "排版技巧",
          "url": "/standard/index.html#排版技巧",
          "content": "排版技巧空格的使用所有的中文字和半形的英文、数字、符号、链接之间应该插入一段间隙，这是因为挤在一起的中西文混排导致西文难以阅读，最简单的插入间隙的技巧就是使用空格，推荐使用 YDoc 插件 ydoc-plugin-pangu查看下面的示例，会发现加入空格的段落，英文、数字、符号、链接更易读：不加入空格的段落:YDoc是一个文档站构建工具,累计的Star数量已超过200个,官网链接为YDoc官网欢迎大家使用加入空格的段落: YDoc 是一个文档站构建工具, 累计的 Star 数量已超过 200 个,官网链接为 YDoc官网 欢迎大家使用"
        }
      ]
    }
  ]
}