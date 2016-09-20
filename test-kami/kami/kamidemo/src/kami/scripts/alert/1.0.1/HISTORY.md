## 0.0.3

+ 添加对extraClass的支持

## 0.0.4

`add` stylesObj ，支持自己设置style， 支持设置haskMask，支持resizable

## 1.0.0

在原有的单例基础上提供非单例使用方式。

```
//kami为kami组件所在的路径别名，具体路径参考项目自身配置
var Alert = require('kami/alert.js');
//单例
Alert.show({content:'我是alert'});
//非单例
var alert = new Alert({content:'我是alert'});

```

## 1.0.1

`fix` 不传title没有header的bug