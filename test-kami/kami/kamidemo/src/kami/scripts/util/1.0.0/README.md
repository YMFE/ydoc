## util

util工具库

如果引用了外部的touch事件库，也同样实现了tap事件，为了避免冲突，可以通过下面的代码禁止掉kami的tap事件

```
window.Kami.disableTapEvent = false
```