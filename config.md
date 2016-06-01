## 配置文件

配置文件可以以 `ydoc.config` 或者 `ydocfile.js` 的形式出现。

### 静态文件形式

`ydoc.config` 的内容是 `JSON`，支持注释。

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

### 整体配置说明

示例:

```json
{
    "name": "YDoc",
    "dest": "path/to/destination", // 默认为  "_docs"
    "examplePath": "./examples", // 示例代码路径 默认 "./"
    "template": "path/to/templte", // 默认使用 YDoc 内置的模板
    "options": { // 通用编译器配置
        "markdwon": { // 对于 markdown 编译器进行统一配置
            "memuLevel": 2
        }
    },
    "common": { // 通用配置，包括主页配置等
        "title": "YDoc",
        "footer": "Made By YMFE Team. © 2014 - 2016",
        "home": "YMFE",
        "homeUrl": "http://ymfe.org/",
        "navbars": [{ // 导航栏配置
            "name": "YDoc",
            "url": "http://ymfe.org/ydoc/"
        }]
    },
    "pages": [{
        "name": "index", // Page Name 会根据他生成 html 文件，例  index.html
        "title": "开始", // Page Title
        "banner": { // Banner 配置
            "title": "YDoc",
            "description": "开始"
        },
        "content": "./README.md",  // 内容
        "compile": "markdown", // 解析器，如果内容有固定的扩展名，此项可忽略
        "options": { // 此 Page 用的编译器的配置
            "menuLevel": 2
        }
    }, {
        "name": "hybird",
        "title": "混合开发",
        "intro": "document/README.md", // 介绍
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
            "sidebar": true,
            "multi": true, // 多页配置
            "index": "./Libraries/extension/INTRO.md", // 首页配置
            "pages": [{ // 每页配置
                "name": "ListView",
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

```json
{
    "type": "component", // 类型，可选 component 和 lib，默认 component
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
