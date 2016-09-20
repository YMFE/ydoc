## alert组件
alert 组件提供了两种使用形式：单例和多例。

使用方式：

```
//kami为kami组件所在的路径别名，具体路径参考项目自身配置
var Alert = require('kami/alert.js');
//单例
Alert.show({content:'我是alert'});
//非单例
var alert = new Alert({content:'我是alert'});

```