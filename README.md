# QDoc [![npm version](https://badge.fury.io/js/q-doc.svg)](http://badge.fury.io/js/q-doc)

前端工程文档生成工具

![](https://nodei.co/npm/q-doc.png?downloads=true&downloadRank=true&stars=true)

## 安装使用方式

#### 安装：

```
npm install q-doc [-g]
```

#### 命令方式：

```
cd /path/to/project/
qdoc build
```

#### 脚本方式

```javascript
var qdoc = require("q-doc");

qdoc.build('/path/to/project', options);
```

#### `gulp` 方式

```javascript
var qdoc = require("q-doc");

gulp.task('qdoc', function() {
    return gulp.src('./')
        .pipe(qdoc({
            // 配置
        }));
});
```

#### `grunt` 方式

```javascript
grunt.initConfig({
    qdoc: {
        // 配置
    }
});

grunt.loadNpmTasks('q-doc');
```
