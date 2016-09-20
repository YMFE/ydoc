## 1.0.0

在原有的单例基础上提供非单例使用方式。


```
//kami为kami组件所在的路径别名，具体路径参考项目自身配置
var Tip = require('kami/tip.js');
//单例
Tip.show({content:'我是tip'});
//非单例
var tip = new Tip({content:'我是tip'});

```