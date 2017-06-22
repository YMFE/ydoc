## 简介

[![npm version](https://badge.fury.io/js/ydoc.svg)](http://badge.fury.io/js/ydoc)

![](https://nodei.co/npm/ydoc.png?downloads=true&downloadRank=true&stars=true)

`YDoc` 是基于代码注释与 `markdown` 快速构建文档的工具，目前支持诸如：`React Native`, `JavaScript`, `CSS`, `SCSS` 等类别。

## 安装

```bash
npm install ydoc [-g]
```

## 使用方式

### 使用命令方式

* `cd /path/to/project/` 进入项目目录
* `ydoc init` 初始化 YDoc 配置文件 ydoc.json（[配置说明](./usage.html#配置文件)）
* `ydoc build` 构建文档，更多命令请查看（[构建命令](./usage.html#构建命令)）


### 使用其他方式

1. 使用脚本：

    ```javascript
    var ydoc = require("ydoc");

    ydoc.build('/path/to/project', options);
    ```

2. 使用Gulp：

    ```javascript
    var ydoc = require("ydoc");

    gulp.task('ydoc', function() {
        return gulp.src('./')
            .pipe(ydoc({
                // 配置
            }));
    });
    ```

3. 使用Grunt：

    ```javascript
    grunt.initConfig({
        ydoc: {
            // 配置
        }
    });

    grunt.loadNpmTasks('ydoc');
    ```

## 构建示例

想知道ydoc能构建什么样的文档吗？

[ydoc-demo](https://github.com/YMFE/ydoc-demo) 展示了一些使用ydoc构建的文档案例，帮助您快速了解ydoc。


## 开发者

* 林洋 <adwon.lin@qunar.com> | <edwon.lim@gmail.com>
* 董文博 <wenbo.dong@qunar.com>
* 王丽丽 <leila.wang@qunar.com>
