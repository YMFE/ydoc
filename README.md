# YDoc

## 简介

前端工程文档生成工具

[![npm version](https://badge.fury.io/js/ydoc.svg)](http://badge.fury.io/js/ydoc)

![](https://nodei.co/npm/ydoc.png?downloads=true&downloadRank=true&stars=true)

## 安装

```
npm install ydoc [-g]
```

## 使用方式

### 命令

```
cd /path/to/project/
ydoc build
```

详细请查看[命令使用说明](./usage.md)。

### 脚本

```javascript
var ydoc = require("ydoc");

ydoc.build('/path/to/project', options);
```

### Gulp

```javascript
var ydoc = require("ydoc");

gulp.task('ydoc', function() {
    return gulp.src('./')
        .pipe(ydoc({
            // 配置
        }));
});
```

### Grunt

```javascript
grunt.initConfig({
    ydoc: {
        // 配置
    }
});

grunt.loadNpmTasks('ydoc');
```

配置及配置文件请查看 [配置说明](./config.md);

## 开发者

* 林洋 <adwon.lin@qunar.com> | <edwon.lim@gmail.com>
* 王丽丽 <leila.wang@qunar.com>
