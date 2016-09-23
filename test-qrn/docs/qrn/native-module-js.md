## 为 Native 组件进行 js 封装

由 Native 桥接而来的组件，均可直接通过`NativeModules`模块访问得到。例如 Native 编写了一个插件名为`MyPlugin`，则可由以下代码访问到：

``` js
import { MyPlugin } from 'NativeModules';
```

但直接由 Native 导出的各种方法均有严格的参数类型等限制，而且在线上环境中传入错误的参数数量或类型会导致应用直接崩溃。因此，我们可以通过 js 对 native 组件进行一次封装，不但可以减少应用崩溃的几率，也可以把参数检查的逻辑转到 js 中来，减少一部分与 native 通信的次数，提高效率。

首先，创建封装组件的 js 文件：

``` js
/**
 * 添加下面一行注释，可以将此文件放在项目的任意位置，而直接在代码中 import 此模块
 * @providesModule MyPlugin
 */

let _nativeMyPlugin = require('NativeModules').MyPlugin;
if (!_nativeMyPlugin) {
  console.warn('找不到MyPlugin的Native模块');
}

class MyPlugin {
}

export default MyPlugin;
```

添加封装的方法：

``` js
class MyPlugin {
  myMethod(arg1, callback) {
    if (!arg1) console.error("arg1 not exist");
    let _callback = callback;
    if (!callback) _callback = () => {};
    
    _nativeMyPlugin.myMethod(arg1, _callback);
  }
}
```


