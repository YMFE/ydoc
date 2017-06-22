## 安装

安装正式版
> npm install ydoc -g

安装测试版 (有新功能但不稳定)
> npm install ydoc@beta -g

## 构建命令

> ydoc build [-t templatePath] [-p page] [-w] [-o dest]

读取配置，构建文档

* `-w|--watch`: 监听变化自动构建
* `-t|--template`: 参数为自定义模板路径
* `-o|--output`: 输出目录
* `-p|--page`: 指定编译某页，默认编译所有。（多个页面名可以逗号分开，例 -p index,demo）

## 初始化命令

> ydoc init [-t templatePath]

初始项目，创建配置文件或自定义模板(-t)，默认生成 `ydoc.config` 文件。

* `-t|--template`: 参数为自定义模板路径


## 配置文件

配置文件可以以 `ydoc.json` 、 `ydoc.config` 或者 `ydocfile.js` 的形式出现。

### 静态文件形式

`ydoc.json` 与 `ydoc.config` 的内容是 `JSON`，支持注释。

示例：

```json
{
    "name": "YDoc",
    ...
}
```

### 动态脚本形式

`ydocfile.js` 可以 `exports` 一个 `Object` 配置，也可以 `exports` 一个 `Function` 用于执行获取配置。

示例1：

```js
module.exports = {
    "name": "YDoc",
    ...
};
```

示例2：

```js
module.exports = function() {
    return {
        "name": "YDoc",
        ...
    };
};
```

示例3：(支持异步返回)

```js
module.exports = function(callback) {
    // do someing
    callback({
        "name": "YDoc",
        ...
    });
};
```

## 配置内容

示例:

```json
{
    "name": "YDoc", // 标示 配置文件
    "dest": "path/to/destination", // 默认为  "doc"
    "examplePath": "./examples", // 示例代码路径 默认 "./"
    "template": "path/to/templte", // 默认使用 YDoc 内置的模板
    "instructionsInfoPath": "./demo/component", //使用说明 内容路径
    "instructionsUrlPath": "./demo/component", //使用说明demo路径
    "theme": "ocean", // 配置主题，默认没有主题
    "defaultGrammer": "javascript", // 默认高亮语法
    "mutiversion": { // 配置多版本切换，使用此功能需要切换到新的分支(此分支专门用于生成文档)，在新分支的配置文件中添加此配置项
        "docbranch": "doc", // 新分支(专门用于生成文档的分支)名称
        "versions":[{
            "name": "3.0", // 需要生成的版本名称
            "branch": "v3.0.0" // 需要生成的版本所在的git分支
        },{
            "name": "4.0",
            "branch": "v4.0.0"
        },{
            "name": "4.1",
            "branch": "v4.1.0"
        }] // 需要切换的版本信息
    },
    "options": { // 通用编译器配置
        "markdown": { // 对于 markdown 编译器进行统一配置
            "menuLevel": 2 //选取第几级 head 作为目录，默认 -1 没有目录
        },
        "foldcode": true, // 是否折叠示例code
        "foldparam": true, // 是否折叠param
        "foldsidenav": true, // 是否折叠侧边目录，默认不折叠
        "staticsidenav": true, // 侧边目录不折叠且不跟随页面滚动
        "insertCSS": ["./style/a.css","./style/b.css"],  // 配置css路径，可覆盖默认样式； 相对路径需要配置resources路径
        "insertJS": ["./scripts/a.js"],  // 配置js路径；相对路径需要配置resources路径
        "hasPageName": true //是否添加页面名称，默认关闭；(文件名不包含中文和特殊字符)
    },
    "resources": { // 将配置的文件夹拷贝至生成文档的文件夹下
            "images": "./test-reactweb/docs/images/",   
            "demo":"./test-reactweb/docs/demo/",
            "style": "./style/",  // 指定insertCss后，配置css的目录
            "scripts": "./scripts/", // 指定insertJS后，配置js的目录
    },
    "common": { // 通用默认配置，包括主页配置等
        "title": "YDoc", //page title
        "footer": "&copy; 2017 <a href=\"http://ued.qunar.com/ymfe/\">YMFE</a> Team. Build by <a href=\"http://ued.qunar.com/ydoc/\">ydoc</a>.", // 通用尾
        "home": "YMFE", // logo
        "homeUrl": "http://ued.qunar.com/ymfe/" // logourl
    },
    "pages": [{
        "name": "index", // Page Name 会根据他生成 html 文件，例: index.html
        "title": "开始", // Page Title
        "homepage": { // 配置首页，样式区别于其他页面
            "version": "v3.0.0", // 版本信息将显示在banner底部
            "button": [{ // 按钮组将显示在banner底部
                "name": "&nbsp;&nbsp;起步&nbsp;&nbsp;",
                "href": "./start.html"
            },{
                "name": "Github",
                "href": "https://github.com/YMFE/ydoc"
            }],
            "intro": [{ // 首页的正文部分，数组项依次渲染，可重复使用
                "title": "为前端开发者设计的文档生成工具", // 介绍板块标题
                "desc": "YDoc让文档开发更简单高效，让开发者专注于程序本身，让项目代码更具可读性、可维护性。" // 介绍板块描述
            },{
                "title": "特性",
                "detail": {
                    "type": "thumbnail", // 三列布局的介绍板块
                    "content": [{ // 三列布局的内容，每项的key值非必需，但建议每列的key值一致
                        "name": "丰富、可扩展的API", // 板块名称
                        "src": "http://ojk406wln.bkt.clouddn.com/intro_muti.png", // 缩略图
                        "desc": "YDoc提供了非常详尽的API，扩展性较强，如果你希望添加某些功能，可以在<a href=\"https://github.com/YMFE/ydoc\" target=\"_blank\"> Github </a>上面提Issue。" // 描述
                    },{
                        "name": "基于注释/markdown",
                        "src": "http://ojk406wln.bkt.clouddn.com/intro_md.png",
                        "desc": "基于项目代码注释与markdown快速构建文档，二者亦可在同一页面中使用。"
                    },{
                        "name": "可配置主题",
                        "src": "http://ojk406wln.bkt.clouddn.com/intro_theme.png",
                        "desc": "官方提供多套主题，并且支持用户自定义开发主题。"
                    }]
                }
            }]
        },
        "banner": { // Banner 配置
            "title": "YDoc",
            "description": "开始"
        },
        "content": "./README.md",  // 内容
        "compile": "markdown", // 解析器，如果内容有固定的扩展名，此项可忽略
        "options": { // 此 Page 用的编译器的配置
            "menuLevel": 2,
            "foldsidenav": true // 是否折叠侧边目录(优先级高于通用编译器配置)
        }
    }, {
        "name": "hybird",
        "title": "混合开发",
        "intro": "document/README.md", // 介绍 introduction
        "content": { // 单页多模块配置
            "sidebar": true, // 是否显示侧边目录
            "blocks": [{
                "name": "简介", // 标题
                "content": "document/hybrid/README.md" // 内容
            }, {
                "name": "Hybrid" // 只有标题，做目录和分割用
            }, {
                "name": "说明",
                "sub": true, // 标题在目录里已子目录形式显示
                "content": "modules/hybrid/framework/README.md"
            }]
        }
    }, {
        "name": "component",
        "title": "组件",
        "banner": {
            "title": "移动端组件",
            "description": "组件"
        },
        "content": { // 多页配置，multi 为 true
            "sidebar": true, //是否显示侧边目录
            "multi": true, // 多页配置
            "index": "./Libraries/extension/INTRO.md", // 首页配置
            "pages": [{ // 每页配置
                "name": "ListView",
                "index": "list", // 修改默认路径名
                "content": "./Libraries/extension/libs/ListView/QListView.js"
            }, {
                "name": "ScrollView",
                "content": "./Libraries/extension/libs/ScrollView/ScrollView.js"
            }]
        }
    }]
}
```

### 解析器配置

#### js

支持文件类型：`.js`，`.jsx`
type字段配置的 `component` 和 `lib`，二者所支持的注释规则有所区别，参见[注释规则](./comment.html)。

```json
{
    "type": "component", // 类型，可选 component 和 lib ，默认 component
    "source": false // 是否生成源文件预览，默认 false
}
```

#### css

支持文件类型：`.css`，`.sass`，`.scss`

```json
{
    "source": false // 是否生成源文件预览，默认 false
}
```

#### markdown

支持文件类型：`.md`，`.markdown`

```json
{
    "menuLevel": 2, // 选取第几级 head 作为目录，默认 -1 没有目录
    "subMeneLevel": 3 // 选取第几级 head 作为子目录，默认 menuLevel + 1
}
```
