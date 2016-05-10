# QDoc

## 简介

前端工程文档生成工具

[![npm version](https://badge.fury.io/js/q-doc.svg)](http://badge.fury.io/js/q-doc)

![](https://nodei.co/npm/q-doc.png?downloads=true&downloadRank=true&stars=true)

## 安装

```
npm install q-doc [-g]
```

## 使用方式

### 命令

```
cd /path/to/project/
qdoc build
```

详细请查看[命令使用说明](./usage.md)。

### 脚本

```javascript
var qdoc = require("q-doc");

qdoc.build('/path/to/project', options);
```

### Gulp

```javascript
var qdoc = require("q-doc");

gulp.task('qdoc', function() {
    return gulp.src('./')
        .pipe(qdoc({
            // 配置
        }));
});
```

### Grunt

```javascript
grunt.initConfig({
    qdoc: {
        // 配置
    }
});

grunt.loadNpmTasks('q-doc');
```

配置及配置文件请查看 [配置说明](./config.md);

## 开发者

林洋 <adwon.lin@qunar.com>
